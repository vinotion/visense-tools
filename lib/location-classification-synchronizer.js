'use strict';

let checkUtils = require('./check-utils'),
    WebSocket  = require('ws');


/**
 * Factory function, create an object instance.
 *
 * WebSocket connection to a ViSense system WebSocket API.
 *
 * @param {object} socketAddress ViSense system socket address.
 * @param {string} sessionToken  Authentication session token.
 *
 * @returns {object} WebSocketConnection object instance.
 *
 * @throws When invalid function parameters are provided.
 */
function LocationClassificationSynchronizer(socketAddress, sessionToken)
{
  // Validate function parameters
  checkUtils.checkSocketAddress(socketAddress);
  checkUtils.checkSessionToken(sessionToken);

  // Private class members
  let _gps = {
    websocket: null,
    url: `ws://${socketAddress.ip}:${socketAddress.port}/api/v1/data/main/object/gps?X-AUTHENTICATION-TOKEN=${sessionToken}`
  };
  let _classification = {
    websocket: null,
    url: `ws://${socketAddress.ip}:${socketAddress.port}/api/v1/data/main/object/classification/live?X-AUTHENTICATION-TOKEN=${sessionToken}`
  };

  let LocationClassificationSynchronizerProto =
    {
      /**
       * Open the required WebSocket connections.
       *
       * @returns {object} Promise with the open call. The callback prototypes are:
       *                    - resolve()
       *                    - reject({string} error message)
       */
      open: function ()
      {
        const checkWebsocket = (dataType) => {
          if (dataType.websocket !== null) {
            throw Error(`WebSocket with url '${dataType.url}' still in use / not closed (properly).`);
          }
        }
        checkWebsocket(_gps);
        checkWebsocket(_classification);

        const openWebsocketPromise = (dataType) => new Promise((resolve, reject) => {
          dataType.websocket = new WebSocket(dataType.url);

          // Register event handlers
          dataType.websocket.on('open', resolve);
          dataType.websocket.on('close', () => reject(`WebSocket with url '${dataType.url}' was closed.`));
          dataType.websocket.on('error', (error) => reject(error.message + dataType.url));
        });

        return Promise.all([
          openWebsocketPromise(_gps),
          openWebsocketPromise(_classification)
        ]);
      },

      /**
       * Open the WebSocket streams, and received a combined message with the following data format:
       * {
       *   reference: 'location-classification-synchronizer',
       *   packet: {
       *     id: 'Channel/GpsLocationCalculator',
       *     type: 'ObjectGpsLocationPacket',
       *     ts: 'YYYY-MM-DDTHH:MM:ss.SSS',
       *     meta: xx,
       *     payload: {
       *       UUID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
       *       GpsCoordinate: {
       *         latitude xx,
       *         longitude: xx,
       *       },
       *       Classification: 'xx'
       *     }
       *   }
       * }
       *
       * @param {string} onDataCallback Callback to be executed on data. Prototype:
       *                                 - onDataCallback({string} data) -> bool
       *                                if onDataCallback returns true, promise will resolve.
       *
       * @returns {object} Promise with the query call. The callback prototypes are:
       *                    - resolve()
       *                    - reject({string} error message)
       *                   The Promise will resolve after onDataCallback has returned true.
       *
       * @throws An error when the WebSocket connection was closed prior to the query.
       * @throws An error when no onDataCallback has been passed.
       */
      send: function (onDataCallback)
      {
        const checkWebsocket = (dataType) => {
          if (dataType.websocket.readyState !== 1) {
            throw Error(`WebSocket with url '${dataType.url}' not opened (yet).`);
          }
        }
        checkWebsocket(_gps);
        checkWebsocket(_classification);

        if (onDataCallback === undefined) {
         throw Error('onDataCallback not defined.');
        }

        const query = JSON.stringify({
          reference: "location-classification-synchronizer",
          command: {
            set: {
              select: {
                DoStreaming: "true"
              },
              filter: "parameter"
            }
          }
        });

        let uuidList = {};
        const synchronizeData = (callback, fData) => {
          let data = JSON.parse(fData);

          if (  !data.packet
             || !['ObjectClassificationPacket', 'ObjectGpsLocationPacket'].includes(data.packet.type)
             || !data.packet.payload
          ) {
            return false;
          }

          if (data.packet.type === 'ObjectClassificationPacket') {
            if (data.packet.meta === 2) {
              delete uuidList[data.packet.payload.Uuid];
            } else {
              // TODO: Don't assume the hierarchical classification layer, but parse dynamically.
              uuidList[data.packet.payload.Uuid] = data.packet.payload.Classification.Classifications[0].Classifications[0].Value;
            }
          } else {
            data.packet.payload.Classification = uuidList[data.packet.payload.UUID];
            callback(data);
          }
        };

        const sendWebsocketQuery = (dataType) => new Promise((resolve, reject) => {
          dataType.websocket.send(query, { mask: true }, (error) => {
            if (error) {
              reject(error.message);
            }
          });
          dataType.websocket.on('message', (data) => {
            if (synchronizeData(onDataCallback, data)) {
              resolve();
            }
          });
          dataType.websocket.on('close', () => reject(`WebSocket with url '${dataType.url}' was closed`));
          dataType.websocket.on('error', (error) => reject(error.message));
        });

        return Promise.all([
          sendWebsocketQuery(_gps),
          sendWebsocketQuery(_classification)
        ]);
      },


      /**
       * Close the WebSocket connections.
       *
       * @returns {object} Promise with the close call. The callback prototypes are:
       *                    - resolve()
       *                    - reject({string} error message)
       */
      close: function ()
      {
        const checkWebsocket = (dataType) => {
          if (dataType.websocket) {
            throw Error(`WebSocket with url '${dataType.url}' is not opened.`);
          }
        }
        checkWebsocket(_gps);
        checkWebsocket(_classification);

        const closeWebsocket = (dataType) => new Promise((resolve, reject) => {
          dataType.websocket.on('close', () => {
            dataType.websocket = null;
            resolve();
          });
          dataType.websocket.on('error', (error) => reject(error.message));
          dataType.websocket.close();
        });

        return Promise.all([
          closeWebsocket(_gps),
          closeWebsocket(_classification)
        ]);
      }
    };

  return Object.assign(Object.create(LocationClassificationSynchronizerProto));
}


// Define exports
module.exports = LocationClassificationSynchronizer;
