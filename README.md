# ViSense API tools

[![Documentation](https://inch-ci.org/github/vinotion/visense-tools.svg?branch=master "Inch CI Documentation")](https://inch-ci.org/github/vinotion/visense-tools)

## Introduction

This set of tools can be used to facilitate the integration configuration/data API of a
 [ViSense system](http://www.visense.eu). It comprises of the following parts:

* Authentication module,
* WebSocket connection manager class,
* Configuration API ajax call adapter,
* Convenience class for retrieving basic system information.

### License

This software is licensed under the MIT license.

## Version information

This library runs a major version number identical to the version number of the API it is compatible with.
I.e. visense-tools v1.x and v2.x are to be used for ViSense v1.x and v2.x devices, respectively.

## Command-line utilities

A set of command-line tools in the `bin/` directory makes use of ViSense tools easy.

### visense-authentication

Use `visense-authentication` to acquire/free a session token.

```
  Usage: visense-authentication [options]

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    --ip <ip>                      IP-address
    --port <port>                  Port number (default: 80)
    --command <signIn|signOut>     Authentication command to be executed.
    --username <username>          Username (mandatory for command signIn)
    --password <password>          Password (mandatory for command signIn)
    --sessionToken <sessionToken>  Session token (mandatory for command signOut)
```

For example:

```
 $ visense-authentication --ip '192.168.0.100' --command 'signIn' --username 'admin' --password 'MyPassword'

 5e23e335-3689-47e8-9b58-f547bc8e84b0
```

```
 $ visense-authentication --ip '192.168.0.100' --command 'signOut' --clientToken '5e23e335-3689-47e8-9b58-f547bc8e84b0'
```

### visense-systeminfo

Use `visense-systeminfo` to list some basic information of a ViSense system.

```
  Usage: visense-systeminfo [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    --ip <ip>              IP-address
    --port <port>          Port number (default: 80)
    --username <username>  Username
    --password <password>  Password
```

For example:

```
 $ visense-systeminfo --ip '192.168.0.100' --username 'admin' --password 'MyPassword'

 ViSense system information:
 ---------------------------
 ID                : 192.168.0.100
 Product name      : ViSense CrowdDynamics
 Service tag       : D34DB33F
 Connection status : Video connection established.
```

## ToDo

* Add example code for each utility class.
* Add unit tests for the check-utils.
* Add support for RFC-1123 host names in socket addresses.
* Improve error handling and propagation.
* Parsing of JSON formatted errors.
* Move static socket-addres-related tests from class tests to check-utils tests.
* Add generic library functions for WebSocket message / data parsing.
* Change all string-type errors to native 'Error' types.
