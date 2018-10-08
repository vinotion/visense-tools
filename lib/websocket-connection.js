'use strict';

let checkUtils = require('./check-utils'),
    WebSocket  = require('ws');


/**
 * Factory function, create an object instance.
 *
 * WebSocket connection to a ViSense system WebSocket API.
 *
 * @param {object} socketAddress ViSense system socket address.
 * @param {string} url           ViSense API URL (e.g. '/api/v1/data/main/count/preset0').
 * @param {string} sessionToken  Authentication session token.
 *
 * @returns {object} WebSocketConnection object instance.
 *
 * @throws When invalid function parameters are provided.
 */
function WebSocketConnection(socketAddress, url, sessionToken)
{
  // Validate function parameters
  checkUtils.checkSocketAddress(socketAddress);
  checkUtils.checkSessionToken(sessionToken);

  if (  !checkUtils.isDefinedString(url)
     || (url.length === 0))
  {
    throw Error('Parameter \'url: ""\' is invalid or empty');
  }

  // Private class members
  let _webSocket = null;
  const _url = 'ws://' + socketAddress.ip + ':' + socketAddress.port + url + '?X-AUTHENTICATION-TOKEN=' + sessionToken;

  // WebSocketConnection class prototype.
  let WebSocketConnectionProto =
    {
      /**
       * Open a WebSocket connection.
       *
       * @returns {object} Promise with the open call. The callback prototypes are:
       *                    - resolve()
       *                    - reject({string} error message)
       */
      open: function ()
      {
        if (_webSocket !== null)
        {
          throw Error('WebSocket still in use not closed (properly)');
        }

        return new Promise((resolve, reject) =>
          {
            _webSocket = new WebSocket(_url);

            // Register event handlers
            _webSocket.on('open', resolve);
            _webSocket.on('close', () =>
              {
                reject('WebSocket was closed');
              });
            _webSocket.on('error', (error) =>
              {
                reject(error.message);
              });
          });
      },

      /**
       * Send a query to the WebSocket.
       *
       * @param {string} query  Query string.
       * @param {string} onData Callback to be executed on data. Prototype:
       *                         - onData({string} data) -> {bool}
       *                        The onData callback should return 'true' upon stream end,
       *                         false if the connection must be preserved. If the onData
       *                         callback is not provided, the returned promise from send
       *                         will instantaneously resolve.
       *
       * @returns {object} Promise with the query call. The callback prototypes are:
       *                    - resolve()
       *                    - reject({string} error message)
       *
       * @throws An error when the WebSocket connection was closed prior to the query.
       */
      send: function (query, onDataCallback)
      {
        if (_webSocket.readyState !== 1)
        {
          throw Error('WebSocket not opened (yet)');
        }

        return new Promise((resolve, reject) =>
          {
            _webSocket.send(query, { mask: true }, (error) =>
              {
                if (typeof error !== 'undefined')
                {
                  reject(error.message);
                }
              });
            _webSocket.on('message', (data) =>
              {
                if (typeof onDataCallback === 'undefined')
                {
                  resolve();
                }

                if (onDataCallback(data))
                {
                  resolve();
                }
              });
            _webSocket.on('close', () =>
              {
                reject('WebSocket was closed');
              });
            _webSocket.on('error', (error) =>
              {
                reject(error.message);
              });
          });
      },

      /**
       * Close the WebSocket connection.
       *
       * @returns {object} Promise with the close call. The callback prototypes are:
       *                    - resolve()
       *                    - reject({string} error message)
       */
      close: function ()
      {
        if (!_webSocket)
        {
          throw Error('WebSocket is not opened');
        }

        return new Promise((resolve, reject) =>
          {
            _webSocket.on('close', () =>
              {
                _webSocket = null;
                resolve();
              });
            _webSocket.on('error', (error) =>
              {
                reject(error.message);
              });
            _webSocket.close();
          });
      }
    };

  return Object.assign(Object.create(WebSocketConnectionProto));
}


// Define exports
module.exports = WebSocketConnection;
