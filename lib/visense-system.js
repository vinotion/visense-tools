'use strict';

let checkUtils           = require('./check-utils'),
    ConfigurationAdapter = require('./configuration-adapter');


/**
 * Factory function, create an object instance.
 *
 * The ViSenseSystem class is a convenience class to get basic information about a
 *  ViSense system.
 *
 * @param {object} socketAddress System socket address: { ip: "", port: # }.
 * @param {string} sessionToken  Authentication session token.
 * @param {string} id            User-specified system identifier.
 *
 * @returns {object} A ViSenseSystem class instantiation.
 *
 * @throws When invalid function parameters are supplied.
 */
function ViSenseSystem(socketAddress, sessionToken, id)
{
  // Assign user-specified ID
  if (checkUtils.isDefinedNonString(id))
  {
    throw new Error('Parameter \'id: ""\' has invalid type');
  }
  else if (typeof id === 'undefined')
  {
    var _id = socketAddress.ip;
  }
  else
  {
    var _id = id;
  }

  // Other function parameters are checked downstream
  const _configAdapter = ConfigurationAdapter(socketAddress, sessionToken);

  // Class prototype.
  let ViSenseSystemProto =
    {
      /**
       * Get a string with the user-defined system identifier.
       *
       * @returns {string} The system identification string.
       */
      getId()
      {
        return _id;
      },


      /**
       * Query for the product name.
       *
       * @returns {object} A promise with the query. The resolve/reject callback
       *                    prototypes are: - resolve({string} product name)
       *                                    - reject({string} error message)
       */
      queryProductName()
      {
        return _configAdapter.queryParameter('Application/Services/Device/ProductName');
      },


      /**
       * Query for the system service tag.
       *
       * @returns {object} A promise with the query. The resolve/reject callback
       *                    prototypes are: - resolve({string} service tag)
       *                                    - reject({string} error message)
       */
      queryServiceTag()
      {
        return _configAdapter.queryParameter('Application/Services/Device/ServiceTag');
      },


      /**
       * Query for the system camera connection status.
       *
       * @returns {object} A promise with the query. The resolve/reject callback
       *                    prototypes are: - resolve({string} connection status)
       *                                    - reject({string} error message)
       */
      queryConnectionStatus()
      {
        return _configAdapter.querySignal('Application/Channel/Video/Capture/ConnectionStatus');
      }
    };

  return Object.assign(Object.create(ViSenseSystemProto));
}


// Define exports
module.exports = ViSenseSystem;
