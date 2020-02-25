'use strict';

const checkUtils     = require('./check-utils'),
      requestPromise = require('request-promise-native');


/**
 * Helper function to validate a credentials object (used for authentication).
 *
 * @param {object} credentials Login credentials (see Authentication).
 *
 * @throws An error if the supplied credentials object is invalid or undefined.
 */
function checkCredentials(credentials)
{
  if (  !checkUtils.isDefinedObject(credentials)
     || !checkUtils.isDefinedString(credentials.username)
     || !checkUtils.isDefinedString(credentials.password))
  {
    throw new Error('Parameter \'credentials: { username: "", password: "" }\' invalid');
  }
}


/**
 * Factory function, create an object instance.
 *
 * ViSense authentication class. Uses the HTTP authentication API to acquire a session
 *  token which can be used to perform other API calls on a ViSense system.
 *
 * @param {object}  socketAddress System socket address: { ip: "", port: # }.
 * @param {boolean} useSsl        Flag to indicate whether or not to use SSL.
 *
 * @returns {object} An Authentication class instance.
 *
 * @throws When invalid function parameters are supplied.
 */
function Authentication(socketAddress, useSsl) {

  // Validate function parameters.
  checkUtils.checkSocketAddress(socketAddress);
  if (!checkUtils.isDefinedBoolean(useSsl)) {
    throw new Error('Parameter \'useSsl\' invalid');
  }

  let _sessionToken = '';
  const _defaultOptions = {
    url: (useSsl ? 'https://' : 'http://') + socketAddress.ip + ':' + socketAddress.port + '/api/v2/authenticate',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: '2000',
    json: true,
    rejectUnauthorized: false
  };


  // Class prototype.
  let AuthenticationProto = {
    /**
     * Authentication sign in.
     *
     * @param {object} credentials Login credentials for the system: { username: "", password: "" }.
     *
     * @returns {object} A promise with the sign in action. The resolve/reject call-back
     *                    prototypes are: - resolve()
     *                                    - reject({string} error message)
     *
     * @throws When invalid function parameters are supplied.
     * @throws When trying to sign in when already signed in.
     */
    signIn(credentials) {
      if (_sessionToken !== '') {
        throw new Error('Trying to sign in when already signed in');
      }

      // Validate function parameters
      checkCredentials(credentials);

      let options = JSON.parse(JSON.stringify(_defaultOptions));
      options.body = 'Command=SignIn&Username=' + credentials.username + '&Password=' + credentials.password;

      return requestPromise.post(options, (error, response, body) => {
        if (  !error
           && (response.statusCode === 200)
           && (typeof body.Data !== 'undefined')
           && (typeof body.Data.SessionToken !== 'undefined')) {
          _sessionToken = body.Data.SessionToken;
        }
      });
    },


    /**
     * Authentication sign out.
     *
     * @returns {object} A promise with the sign out action. The resolve/reject call-back
     *                    prototypes are: - resolve()
     *                                    - reject({string} error message)
     *
     * @throws When invalid function parameters are supplied.
     * @throws When trying to sign out when not signed in.
     */
    signOut() {
      if (_sessionToken === '') {
        throw new Error('Trying to sign out when not signed in');
      }

      let options = JSON.parse(JSON.stringify(_defaultOptions));
      options.body = 'Command=SignOut&SessionToken=' + _sessionToken;
      return requestPromise.post(options, (error, response, body) => {
        if (  !error
           && (response.statusCode === 200)
           && (typeof body.Message !== 'undefined')
           && (typeof body.Message.Success !== 'undefined')) {
          _sessionToken = '';
        }
      });
    },


    /**
     * Verify session token validity.
     *
     * @returns {object} A promise with the verification check. The resolve/reject call-
     *                    back prototypes are: - resolve({bool} verification result)
                                               - reject({string} error message)
     */
    verify() {
      let options = JSON.parse(JSON.stringify(_defaultOptions));
      options.url = options.url + '?Command=Verify';
      options.headers = { 'X-AUTHENTICATION-TOKEN': _sessionToken };
      return requestPromise(options);
    },


    /**
     * Get session token.
     *
     * @returns {string} The session token (if authenticated successfully), otherwise
     *                    an empty string.
     */
    getSessionToken() {
      return _sessionToken;
    },


    /**
     * Set session token. Used when managnig an existing authentication session.
     *
     * @param {string} Session token.
     *
     * @throws When trying to set an invalid session token.
     */
    setSessionToken(sessionToken) {
      if (!checkUtils.isDefinedString(sessionToken)) {
        throw new Error('Trying to set an invalid session token.');
      }

      _sessionToken = sessionToken;
    }
  };

  return Object.assign(Object.create(AuthenticationProto));
}


// Define exports
module.exports = Authentication;
