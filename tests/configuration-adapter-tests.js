'use strict';

let ConfigurationAdapter = require('../lib/configuration-adapter');


// --------------------------------------------------------------------------------------
QUnit.module('ConfigurationAdapter static tests');

test('Factory function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(12);

    throws(() =>
      {
        ConfigurationAdapter();
      }, 'No parameters');

    throws(() =>
      {
        ConfigurationAdapter(1, 'dummy');
      }, 'Invalid parameters (1; invalid socketAddress object (1))');

    throws(() =>
      {
        ConfigurationAdapter({}, 'dummy');
      }, 'Invalid parameters (2; invalid socketAddress object (2))');

    throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1' }, 'dummy');
      }, 'Invalid parameters (3; missing port number in socketAddress)');

    throws(() =>
      {
        ConfigurationAdapter({ port: 80 }, 'dummy');
      }, 'Invalid parameters (4; missing IP-address in socketAddress)');

    throws(() =>
      {
        ConfigurationAdapter({ ip: '', port: 80 }, 'dummy');
      }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

    throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: '' }, 'dummy');
      }, 'Invalid parameters (6; invalid port number type in socketAddress)');

    throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 3141565 }, 'dummy');
      }, 'Invalid parameters (7; invalid port number in socketAddress)');

    throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 80 });
      }, 'Invalid parameters (8; missing session token parameter)');

    throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 1);
      }, 'Invalid parameters (9; invalid session token parameter type)');

    throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, '');
      }, 'Invalid parameters (10; empty session token parameter type)');

    ok((() =>
      {
        let x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 'dummy');
        return (typeof x === 'object');
      })(), 'Valid function call');
  });


test('queryParameter function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    ok((() =>
      {
        const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 'dummy');

        // Check if the returned value is a Promise (the query will fail)
        return (typeof x.queryParameter('').then === 'function');
      })(), 'Valid function call');
  });


test('querySignal function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    ok((() =>
      {
        const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 'dummy');

        // Check if the returned value is a Promise (the query will fail)
        return (typeof x.querySignal('').then === 'function');
      })(), 'Valid function call');
  });
