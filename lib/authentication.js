'use strict';

let checkUtils     = require('./check-utils'),
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
 * @param {object} socketAddress System socket address: { ip: "", port: # }.
 *
 * @returns {object} An Authentication class instance.
 *
 * @throws When invalid function parameters are supplied.
 */
function Authentication(socketAddress)
{
  checkUtils.checkSocketAddress(socketAddress);

  let _sessionToken = '';
  const _defaultOptions =
    {
      url: 'http://' + socketAddress.ip + ':' + socketAddress.port + '/api/v1/authenticate',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: '100',
      json: true
    };


  // Class prototype
  let AuthenticationProto =
    {
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
      signIn(credentials)
      {
        if (_sessionToken !== '')
        {
          throw new Error('Trying to sign in when already signed in');
        }

        // Validate function parameters
        checkCredentials(credentials);

        let options = JSON.parse(JSON.stringify(_defaultOptions));
        options.body = 'command=signIn&user=' + credentials.username + '&password=' + credentials.password;
        return requestPromise.post(options, (error, response, body) =>
          {
            if (  !error
               && (response.statusCode === 200)
               && (typeof body.data !== 'undefined')
               && (typeof body.data.clientToken !== 'undefined'))
            {
              _sessionToken = body.data.clientToken;
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
      signOut()
      {
        if (_sessionToken === '')
        {
          throw new Error('Trying to sign out when not signed in');
        }

        let options = JSON.parse(JSON.stringify(_defaultOptions));
        options.body = 'command=signOut&clientToken=' + _sessionToken;
        return requestPromise.post(options, (error, response, body) =>
          {
            if (  !error
               && (response.statusCode === 200)
               && (typeof body.message !== 'undefined')
               && (typeof body.message.success !== 'undefined'))
            {
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
      verify()
      {
        let options = JSON.parse(JSON.stringify(_defaultOptions));
        options.url = options.url + '?command=verify';
        options.headers = { 'X-AUTHENTICATION-TOKEN': _sessionToken };
        return requestPromise(options);
      },
        
        
      /**
       * Clear User sessions. When all user sessions are used, this function can clear all
       *  existing sessions. Please note that any other logged-in users will be logged out.
       *
       * @param {object} credentials Login credentials for the system of the user you want 
       *                              to clear all sessions: { username: "", password: "" }.
       *
       * @returns {object} A promise with the result. The resolve/reject call-back
       *                    prototypes are: - resolve({string} succeeded message)
       *                                    - reject({string} error message)
       *
       * @throws When invalid function parameters are supplied.
       * @throws When trying to clear user sessions when existing session is in progress.
       */
      clearUserSessions(credentials)
      {
        if (_sessionToken !== '')
        {
          throw new Error('Trying to clear user sessions when an existing session is present.');
        }

        // Validate function parameters
        checkCredentials(credentials);

        let options = JSON.parse(JSON.stringify(_defaultOptions));
        options.body = 'command=clearUserSessions&user=' + credentials.username + '&password=' + credentials.password;
        return requestPromise.post(options);
      },


      /**
       * Get session token.
       *
       * @returns {string} The session token (if authenticated successfully), otherwise
       *                    an empty string.
       */
      getSessionToken()
      {
        return _sessionToken;
      },


      /**
       * Set session token. Used when managnig an existing authentication session.
       *
       * @param {string} Session token.
       *
       * @throws When trying to set an invalid session token.
       */
      setSessionToken(sessionToken)
      {
        if (!checkUtils.isDefinedString(sessionToken))
        {
          throw new Error('Trying to set an invalid session token.');
        }

        _sessionToken = sessionToken;
      }
    };

  return Object.assign(Object.create(AuthenticationProto));
}


// Define exports
module.exports = Authentication;
