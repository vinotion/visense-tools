'use strict';

let testrunner = require('qunit');

testrunner.run(
  [
    {
      code: './index.js',
      tests: [
        './tests/authentication-tests',
        './tests/configuration-adapter-tests',
        './tests/visense-system-tests',
        './tests/websocket-connection-tests'
      ]
    }
  ], (error, report) =>
    {
      console.log('Report: ', report);
      if (error) console.error('Exception in QUnit TestRunner: ', error);

      if (  (typeof report === 'undefined')
        || (  (typeof report.failed !== 'undefined')
            && (report.failed > 0)))
      {
        process.exitCode = 1;
      }
    });