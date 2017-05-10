'use strict';

let ConfigurationAdapter = require('../lib/configuration-adapter');


// --------------------------------------------------------------------------------------
QUnit.module('ConfigurationAdapter static tests');

test('Factory function', (assert) =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    assert.expect(12);

    assert.throws(() =>
      {
        ConfigurationAdapter();
      }, 'No parameters');

    assert.throws(() =>
      {
        ConfigurationAdapter(1, 'dummy');
      }, 'Invalid parameters (1; invalid socketAddress object (1))');

    assert.throws(() =>
      {
        ConfigurationAdapter({}, 'dummy');
      }, 'Invalid parameters (2; invalid socketAddress object (2))');

    assert.throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1' }, 'dummy');
      }, 'Invalid parameters (3; missing port number in socketAddress)');

    assert.throws(() =>
      {
        ConfigurationAdapter({ port: 80 }, 'dummy');
      }, 'Invalid parameters (4; missing IP-address in socketAddress)');

    assert.throws(() =>
      {
        ConfigurationAdapter({ ip: '', port: 80 }, 'dummy');
      }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

    assert.throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: '' }, 'dummy');
      }, 'Invalid parameters (6; invalid port number type in socketAddress)');

    assert.throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 3141565 }, 'dummy');
      }, 'Invalid parameters (7; invalid port number in socketAddress)');

    assert.throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 80 });
      }, 'Invalid parameters (8; missing session token parameter)');

    assert.throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 1);
      }, 'Invalid parameters (9; invalid session token parameter type)');

    assert.throws(() =>
      {
        ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, '');
      }, 'Invalid parameters (10; empty session token parameter type)');

    assert.ok((() =>
      {
        let x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 'dummy');
        return (typeof x === 'object');
      })(), 'Valid function call');
  });


test('queryParameter function', (assert) =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    assert.expect(1);

    assert.ok((() =>
      {
        const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 'dummy');

        // Check if the returned value is a Promise (the query will fail)
        return (typeof x.queryParameter('').catch(error => {}) === 'object');
      })(), 'Valid function call');
  });


test('querySignal function', (assert) =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    assert.expect(1);

    assert.ok((() =>
      {
        const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 'dummy');

        // Check if the returned value is a Promise (the query will fail)
        return (typeof x.querySignal('').catch(error => {}) === 'object');
      })(), 'Valid function call');
  });
