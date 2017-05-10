'use strict';

let checkUtils     = require('./check-utils'),
    requestPromise = require('request-promise-native');


/**
 * Extract and check response data.
 *
 * @param {response} ViSense configuration API JSON response string.
 *
 * @returns {array} The array of data responses.
 *
 * @throws Error when the response is not a data response.
 */
function extractResponseData(response)
{
  if (  (typeof response !== 'object')
     || (typeof response.data === 'undefined'))
  {
    throw Error('Not a data response');
  }

  return response.data;
}


/**
 * Extract parameter value from ViSense configuration API JSON response.
 *
 * NOTE: This function assumes only a single data value is provided. The first item will
 *        be selected if an array is provided.
 *
 * @param {string} ViSense configuration API parameter JSON response string.
 *
 * @returns {string} Parameter value.
 */
function extractParameterValue(response)
{
  function iterate(input)
  {
    console.assert(typeof input !== 'undefined');

    if (input.constructor === Array)
    {
      // Always take the second item in an array (the first item is the name)
      return iterate(input[1]);
    }
    else
    {
      // Iterate over children
      for (let key in input)
      {
        if (input.hasOwnProperty(key))
        {
          if (typeof input[key] === 'object')
          {
            return iterate(input[key]);
          }
          else
          {
            // Return 'leaf' element value
            return input[key];
          }
        }
      }
    }

    throw Error('Failed to extract parameter value');
  }

  return String(iterate(extractResponseData(response)));
}


/**
 * Extract signal state value from ViSense configuration API JSON response.
 *
 * NOTE: This function assumes only a single data value is provided. The first item will
 *        be selected if an array is provided.
 *
 * @param {string} ViSense configuration API signal JSON response string.
 *
 * @returns {string} Signal state value.
 */
function extractSignalState(response)
{
  function iterate(input)
  {
    console.assert(typeof input !== 'undefined');

    if (input.constructor === Array)
    {
      // Always take the second item in an array (the first item is the name)
      return iterate(input[1]);
    }
    else
    {
      // Iterate over children
      for (let key in input)
      {
        if (input.hasOwnProperty(key))
        {
          if (typeof input[key] === 'object')
          {
            return iterate(input[key]);
          }
          else if (  (typeof key === 'string')
                  && (key === 'state'))
          {
            return input[key];
          }
        }
      }
    }

    throw Error('Failed to extract signal state value');
  }

  return String(iterate(extractResponseData(response)));
}


/**
 * Factory function, create an object instance.
 *
 * ViSense configuration ajax call adapter. This is a wrapper around a regular
 *  XMLHttpRequest, tailored for calls to the ViSense configuration API; using the correct
 *  URL formatting.
 *
 * @param {object} socketAddress System socket address: { ip: "", port: # }.
 * @param {string} sessionToken  Authentication session token.
 *
 * @returns {object} A ConfigurationAdapter class instance.
 *
 * @throws When invalid function parameters are supplied.
 */
function ConfigurationAdapter(socketAddress, sessionToken)
{
  // Validate function parameters
  checkUtils.checkSocketAddress(socketAddress);
  checkUtils.checkSessionToken(sessionToken);

  const _defaultOptions =
  {
    url: 'http://' + socketAddress.ip + ':' + socketAddress.port + '/api/v1/config',
    headers: {
      'X-AUTHENTICATION-TOKEN': sessionToken
    },
    timeout: '100',
    json: true
  }

  /**
   * Query for an entity in the ViSense system. This function will sign in to acquire a
   * session token, query and sign out again to free the session token.
   *
   * @param {string} name The query entity name.
   * @param {string} type The query entity type.
   *
   * @returns {object} A promise with the query. The resolve/reject callback prototypes
   *                    are: - resolve({string} query result)
   *                         - reject({string} error message)
   */
  function query(name, type)
  {
    let queryResult = '';

    let options = JSON.parse(JSON.stringify(_defaultOptions));
    options.url += '?command=get&select=' + name + '&filter=' + type + '&format=json-value-v1';
    return requestPromise.get(options);
  }


  // Class prototype
  let ConfigurationAdapterProto =
    {
      /**
       * Query for a parameter.
       *
       * @param {string} name The parameter name.
       *
       * @returns {object} A promise with the query. The resolve/reject callback prototypes
       *                    are: - resolve({string} parameter value)
       *                         - reject({string} error message)
       */
      queryParameter(name)
      {
        return query(name, 'parameter').then(extractParameterValue);
      },


      /**
       * Query for an event signal.
       *
       * @param {string} name The signal name.
       *
       * @returns {object} A promise with the query. The resolve/reject callback prototypes
       *                    are: - resolve({string} signal state)
       *                         - reject({string} error message)
       */
      querySignal(name)
      {
        return query(name, 'signal').then(extractSignalState);
      }
    };

  return Object.assign(Object.create(ConfigurationAdapterProto));
}


// Define exports
module.exports = ConfigurationAdapter;
