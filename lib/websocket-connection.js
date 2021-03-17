'use strict';

const checkUtils = require('./check-utils'),
      WebSocket  = require('ws');


/**
 * Factory function, create an object instance.
 *
 * WebSocket connection to a ViSense system WebSocket API.
 *
 * @param {object}  socketAddress ViSense system socket address.
 * @param {boolean} useSsl        Flag to indicate whether or not to use SSL.
 * @param {string}  apiPath       ViSense API path (e.g. '/api/v2/data/main/count/preset0').
 * @param {string}  sessionToken  Authentication session token.
 *
 * @returns {object} WebSocketConnection object instance.
 *
 * @throws When invalid function parameters are provided.
 */
function WebSocketConnection(socketAddress, useSsl, apiPath, sessionToken) {

  // Validate function parameters.
  checkUtils.checkSocketAddress(socketAddress);
  if (!checkUtils.isDefinedBoolean(useSsl)) {
    throw new Error('Parameter \'useSsl\' invalid');
  }

  checkUtils.checkSessionToken(sessionToken);

  if (  !checkUtils.isDefinedString(apiPath)
     || (apiPath.length === 0)) {
    throw Error('Parameter \'apiPath: ""\' is invalid or empty');
  }

  // Private class members.
  let _webSocket = null;
  const _url = (useSsl ? 'wss://' : 'ws://') + socketAddress.ip + ':' + socketAddress.port + apiPath + '?X-AUTHENTICATION-TOKEN=' + sessionToken;


  const _reset = () => {
    _webSocket.removeAllListeners('open');
    _webSocket.removeAllListeners('close');
    _webSocket.removeAllListeners('message');
    _webSocket.removeAllListeners('error');
    _webSocket = null;
  }

  // Class prototype.
  let WebSocketConnectionProto = {
    /**
     * Open a WebSocket connection.
     *
     * @returns {object} Promise with the open call. The callback prototypes are:
     *                    - resolve()
     *                    - reject({string} error message)
     */
    open() {
      if (_webSocket !== null) {
        throw Error('WebSocket still in use not closed (properly)');
      }

      return new Promise((resolve, reject) => {
        _webSocket = new WebSocket(_url, { rejectUnauthorized: false });

        const onClose = () => {
          reject('WebSocket was closed');
        };

        const onError = (error) => {
          reject(error.message);
        };

        _webSocket.on('open', () => {
          _webSocket.removeEventListener('close', onClose);
          _webSocket.removeEventListener('error', onError);
          resolve();
        });

        _webSocket.on('close', onClose);
        _webSocket.on('error', onError);
      });
    },


    /**
     * Send a query to the WebSocket.
     *
     * @param {string} query   Query string.
     * @param {string} onData  Callback to be executed on data. Prototype:
     *                          - onData({string} data) -> {bool}
     *                         The onData callback should return 'true' upon stream end,
     *                          false if the connection must be preserved. If the onData
     *                          callback is not provided, the returned promise from send
     *                          will instantaneously resolve at first data. If the
     *                          onData callback is not provided, and no data arrives, the
     *                          promise will resolve after a timeout period.
     * @param {number} timeout Timeout in [milliseconds]. The promise will be resolved if
     *                          this timeout is reached.
     *
     * @returns {object} Promise with the query call. The callback prototypes are:
     *                    - resolve()
     *                    - reject({string} error message)
     *
     * @throws An error when the WebSocket connection was closed prior to the query.
     */
    send(query, onDataCallback, timeout) {
      if (_webSocket.readyState !== 1) {
        throw Error('WebSocket not opened (yet)');
      }

      return new Promise((resolve, reject) => {
        let timer = null;

        const onMessage = (data) => {
          if (  (typeof onDataCallback === 'undefined')
             || onDataCallback(data)) {
            removeEventListeners();
            clearTimeout(timer);
            resolve();
          }
        };

        const onClose = () => {
          clearTimeout(timer);
          removeEventListeners();
          reject('WebSocket was closed');
        };

        const onError = (error) => {
          clearTimeout(timer);
          removeEventListeners();
          reject(error.Message);
        };

        const removeEventListeners = () => {
          if (_webSocket != null) {
            _webSocket.removeEventListener('message', onMessage);
            _webSocket.removeEventListener('close', onClose);
            _webSocket.removeEventListener('error', onError);
          }
        };

        _webSocket.on('message', onMessage);
        _webSocket.on('close',   onClose);
        _webSocket.on('error',   onError);

        _webSocket.send(query, { mask: true }, (error) => {
          if (typeof error !== 'undefined') {
            removeEventListeners();
            reject(error.message);
          }
        });

        if (typeof onDataCallback === 'undefined') {
          // Resolve query without handler callback or data after a grace period.
          timer = setTimeout(() => {
            removeEventListeners();
            resolve();
          }, 200);
        } else if (  (typeof timeout !== 'undefined')
                  && (typeof timeout === 'number')) {
          // Resolve query after a grace period if a timeout is specified.
          timer = setTimeout(() => {
            removeEventListeners();
            resolve();
          }, timeout);
        }
      });
    },


    /**
     * Close the WebSocket connection.
     *
     * @returns {object} Promise with the close call. The callback prototypes are:
     *                    - resolve()
     *                    - reject({string} error message)
     */
    close() {
      if (!_webSocket) {
        throw Error('WebSocket is not opened');
      }

      return new Promise((resolve, reject) => {
        _webSocket.on('close', () => {
          _reset();
          resolve();
        });

        _webSocket.on('error', (error) => {
          reject(error.message);
        });

        _webSocket.close();
      });
    }
  };

  return Object.assign(Object.create(WebSocketConnectionProto));
}


module.exports = WebSocketConnection;
