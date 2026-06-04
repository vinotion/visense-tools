'use strict';

const checkUtils = require('./check-utils'),
      got        = require('got');


/**
 * Normalise a got HTTPError so that callers receive the same error shape that
 * request-promise-native used to produce: err.statusCode and err.error hold the
 * HTTP status code and the parsed response body respectively.
 *
 * @param {Error} err
 * @throws Always re-throws, either normalised or as-is.
 */
function normalizeHttpError(err) {
  if (err.response && err.response.body) {
    const e = new Error(err.message);
    e.statusCode = err.response.statusCode;
    e.error      = err.response.body;
    throw e;
  }

  throw err;
}


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
 * @param {number}  timeout       Optional request timeout in milliseconds (default: 500).
 *
 * @returns {object} An Authentication class instance.
 *
 * @throws When invalid function parameters are supplied.
 */
function Authentication(socketAddress, useSsl, timeout) {

  // Validate function parameters.
  checkUtils.checkSocketAddress(socketAddress);
  if (!checkUtils.isDefinedBoolean(useSsl)) {
    throw new Error('Parameter \'useSsl\' invalid');
  }

  if (typeof timeout !== 'undefined' && !checkUtils.isDefinedNumber(timeout)) {
    throw new Error('Parameter \'timeout\' invalid');
  }

  let _sessionToken = '';
  const _baseUrl = (useSsl ? 'https://' : 'http://') + socketAddress.ip + ':' + socketAddress.port + '/api/v2/authenticate';
  const _gotOptions = {
    responseType: 'json',
    https: { rejectUnauthorized: false },
    timeout: { request: (typeof timeout !== 'undefined') ? timeout : 500 }
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

      return got.post(_baseUrl, {
        ..._gotOptions,
        form: {
          Command: 'SignIn',
          Username: credentials.username,
          Password: credentials.password
        }
      }).then((response) => {
        const body = response.body;
        if (  (response.statusCode === 200)
           && (typeof body.Data !== 'undefined')
           && (typeof body.Data.SessionToken !== 'undefined')) {
          _sessionToken = body.Data.SessionToken;
        }

        return body;
      }).catch(normalizeHttpError);
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

      return got.post(_baseUrl, {
        ..._gotOptions,
        form: {
          Command: 'SignOut',
          SessionToken: _sessionToken
        }
      }).then((response) => {
        const body = response.body;
        if (  (response.statusCode === 200)
           && (typeof body.Message !== 'undefined')
           && (typeof body.Message.Success !== 'undefined')) {
          _sessionToken = '';
        }

        return body;
      }).catch(normalizeHttpError);
    },


    /**
     * Verify session token validity.
     *
     * @returns {object} A promise with the verification check. The resolve/reject call-
     *                    back prototypes are: - resolve({bool} verification result)
                                               - reject({string} error message)
     */
    verify() {
      return got(_baseUrl, {
        ..._gotOptions,
        searchParams: { Command: 'Verify' },
        headers: { 'X-AUTHENTICATION-TOKEN': _sessionToken }
      }).then((response) => response.body)
        .catch(normalizeHttpError);
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
