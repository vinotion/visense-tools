'use strict';

let checkUtils     = require('./check-utils'),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
    Promise        = require('promise');


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

  const _url = 'http://' + socketAddress.ip + ':' + socketAddress.port + '/api/v1/authenticate';
  let _sessionToken = '';


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

        return new Promise((resolve, reject) =>
          {
            let request = new XMLHttpRequest();

            request.onreadystatechange = () =>
              {
                if (request.readyState === 4) // 4 == DONE
                {
                  if (request.status === 200) // 200 == OK
                  {
                    _sessionToken = JSON.parse(request.responseText)['data']['clientToken'];
                    resolve();
                  }
                  else
                  {
                    // TODO: Parse error message instead of dumping a JSON error.
                    reject(request.responseText);
                  }
                }
              }

            request.open('POST', _url);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send('command=signIn&user=' + credentials.username + '&password=' + credentials.password);
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

        return new Promise((resolve, reject) =>
          {
            var request = new XMLHttpRequest();

            request.onreadystatechange = () =>
              {
                if (request.readyState === 4) // 4 == DONE
                {
                  if (request.status === 200) // 200 == OK
                  {
                    var response = JSON.parse(request.responseText);
                    if (  response.hasOwnProperty('message')
                       && response['message'].hasOwnProperty('success'))
                    {
                      _sessionToken = '';
                      resolve();
                    }
                    else
                    {
                      // TODO: Parse error message instead of dumping a JSON error.
                      reject(request.responseText);
                    }
                  }
                  else
                  {
                    // TODO: Parse error message instead of dumping a JSON error.
                    reject(request.responseText);
                  }
                }
              }

            request.open('POST', _url);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.send('command=signOut&clientToken=' + _sessionToken);
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
        return new Promise((resolve, reject) =>
          {
            if (_sessionToken === '')
            {
              resolve(false);
            }

            let request = new XMLHttpRequest();

            request.onreadystatechange = () =>
              {
                if (request.readyState === 4) // 4 == DONE
                {
                  if (request.status === 200) // 200 == OK
                  {
                    resolve(true);
                  }
                  else if (request.status === 401)
                  {
                    resolve(false);
                  }
                  else
                  {
                    // TODO: Parse error message instead of dumping a JSON error.
                    reject(request.responseText);
                  }
                }
              }

            request.open('GET', _url + '?command=verify');
            request.setRequestHeader('X-AUTHENTICATION-TOKEN', _sessionToken);
            request.send();
          });
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
module.exports                    = Authentication;
