'use strict';

let validator = require('validator');


/**
 * Declarative utilities for checking values.
 *
 * Each function returns a {bool} indicating the result of the corresponding test.
 */


function isDefinedBool(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg === 'bool'));
}


function isDefinedNonBool(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg !== 'bool'));
}


function isDefinedNumber(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg === 'number'));
}


function isDefinedNonNumber(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg !== 'number'));
}


function isDefinedString(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg === 'string'));
}


function isDefinedNonString(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg !== 'string'));
}


function isDefinedObject(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg === 'object'));
}


function isDefinedNonObject(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg !== 'object'));
}


function isDefinedFunction(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg === 'function'));
}


function isDefinedNonFunction(arg)
{
  return (  (typeof arg !== 'undefined')
         && (typeof arg !== 'function'));
}


/**
 * Helper function to validate a socket address object.
 *
 * TODO: Add support for RFC1123 host names..
 *
 * @param {object} socketAddress System socket address (see Authentication).
 *
 * @throws If the supplied socket address object is undefined or invalid.
 */
function checkSocketAddress(socketAddress)
{
  if (  !isDefinedObject(socketAddress)
     || !isDefinedString(socketAddress.ip)
     || !isDefinedNumber(socketAddress.port))
  {
    throw new Error('Parameter \'socketAddress: { ip: "", port: # }\' invalid');
  }

  if (!validator.isIP(socketAddress.ip))
  {
    throw new Error('Parameter \'socketAddressip: ' + socketAddress.ip + '\' is an invalid IP-address');
  }

  if (  (socketAddress.port < 0)
     || (socketAddress.port > 65535))
  {
    throw new Error('Parameter \'socketAddress.port: ' + socketAddress.port + '\' is an invalid port number');
  }
}


/**
 * Helper function to validate a session token.
 *
 * @param {string} sessionToken Authentication session token.
 *
 * @throws If the supplied session token is undefined or invalid.
 */
function checkSessionToken(sessionToken)
{
  if (  !isDefinedString(sessionToken)
     || (sessionToken.length === 0))
  {
    throw Error('Parameter \'sessionToken: ""\' invalid or empty');
  }
}


// Define exports
module.exports.isDefinedBool        = isDefinedBool;
module.exports.isDefinedNonBool     = isDefinedNonBool;
module.exports.isDefinedNumber      = isDefinedNumber;
module.exports.isDefinedNonNumber   = isDefinedNonNumber;
module.exports.isDefinedString      = isDefinedString;
module.exports.isDefinedNonString   = isDefinedNonString;
module.exports.isDefinedObject      = isDefinedObject;
module.exports.isDefinedNonObject   = isDefinedNonObject;
module.exports.isDefinedFunction    = isDefinedFunction;
module.exports.isDefinedNonFunction = isDefinedNonFunction;
module.exports.checkSocketAddress   = checkSocketAddress;
module.exports.checkSessionToken    = checkSessionToken;
