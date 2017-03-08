# ViSense API tools

![Build Status](https://travis-ci.org/vinotion/visense-tools.svg?branch=master "Travis CI Build Status")

## Introduction

This set of tools can be used to facilitate the integration configuration/data API of a
 [ViSense system](http://www.visense.eu). It comprises of the following parts:

* Authentication module,
* WebSocket connection manager class,
* Configuration API ajax call adapter,
* Convenience class for retrieving basic system information.

A set of command-line tools in the `bin/` directory makes use of ViSense tools easy.

### License

This software is licensed under the MIT license.

## ToDo

* Add example code for each utility class.
* Add unit tests for the check-utils.
* Add support for RFC-1123 host names in socket addresses.
* Improve error handling and propagation.
* Parsing of JSON formatted errors.
* Move static socket-addres-related tests from class tests to check-utils tests.
* Add generic library functions for WebSocket message / data parsing.
