'use strict';

const ConfigurationAdapter = require('../lib/configuration-adapter');


// --------------------------------------------------------------------------------------
QUnit.module('ConfigurationAdapter unit tests');

test('Factory function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(14);

  assert.throws(() => {
    ConfigurationAdapter();
  }, 'No parameters');

  assert.throws(() => {
    ConfigurationAdapter(1, true, 'dummy');
  }, 'Invalid parameters (1; invalid socketAddress object (1))');

  assert.throws(() => {
    ConfigurationAdapter({}, true, 'dummy');
  }, 'Invalid parameters (2; invalid socketAddress object (2))');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '127.0.0.1' }, true, 'dummy');
  }, 'Invalid parameters (3; missing port number in socketAddress)');

  assert.throws(() => {
    ConfigurationAdapter({ port: 80 }, true, 'dummy');
  }, 'Invalid parameters (4; missing IP-address in socketAddress)');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '', port: 80 }, true, 'dummy');
  }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '127.0.0.1', port: '' }, true, 'dummy');
  }, 'Invalid parameters (6; invalid port number type in socketAddress)');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '127.0.0.1', port: 3141565 }, true, 'dummy');
  }, 'Invalid parameters (7; invalid port number in socketAddress)');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, 'nonsense', 'dummy');
  }, 'Invalid parameters (8; invalid useSsl parameter)');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true);
  }, 'Invalid parameters (9; missing session token parameter)');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true, 1);
  }, 'Invalid parameters (10; invalid session token parameter type)');

  assert.throws(() => {
    ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true, '');
  }, 'Invalid parameters (11; empty session token parameter type)');

  assert.ok((() => {
    const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true, 'dummy');
    return (typeof x === 'object');
  })(), 'Valid function call (SSL enabled)');

  assert.ok((() => {
    const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, false, 'dummy');
    return (typeof x === 'object');
  })(), 'Valid function call (SSL disabled)');
});


test('getParameter function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true, 'dummy');

    // Check if the returned value is a Promise (the query will fail).
    return (typeof x.getParameter('').catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('setParameter function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true, 'dummy');

    // Check if the returned value is a Promise (the query will fail).
    return (typeof x.setParameter('', '').catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('getSignal function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true, 'dummy');

    // Check if the returned value is a Promise (the query will fail).
    return (typeof x.getSignal('').catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('setSlot function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = ConfigurationAdapter({ ip: '127.0.0.1', port: 80 }, true, 'dummy');

    // Check if the returned value is a Promise (the query will fail).
    return (typeof x.setSlot('', '').catch(() => {}) === 'object');
  })(), 'Valid function call');
});
