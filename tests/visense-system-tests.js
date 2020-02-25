'use strict';

const ViSenseSystem = require('../lib/visense-system');


// --------------------------------------------------------------------------------------
QUnit.module('ViSenseSystem static tests');

test('Factory function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(16);

  assert.throws(() => {
    ViSenseSystem();
  }, 'No parameters');

  assert.throws(() => {
    ViSenseSystem(1, true, 'dummy');
  }, 'Invalid parameters (1; invalid socketAddress object (1))');

  assert.throws(() => {
    ViSenseSystem({}, true, 'dummy');
  }, 'Invalid parameters (2; invalid socketAddress object (2))');

  assert.throws(() => {
    ViSenseSystem({ ip: '127.0.0.1' }, true, 'dummy');
  }, 'Invalid parameters (3; missing port number in socketAddress)');

  assert.throws(() => {
    ViSenseSystem({ port: 80 }, true, 'dummy');
  }, 'Invalid parameters (4; missing IP-address in socketAddress)');

  assert.throws(() => {
    ViSenseSystem({ ip: '', port: 80 }, true, 'dummy');
  }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

  assert.throws(() => {
    ViSenseSystem({ ip: '127.0.0.1', port: '' }, true, 'dummy');
  }, 'Invalid parameters (6; invalid port number type in socketAddress)');

  assert.throws(() => {
    ViSenseSystem({ ip: '127.0.0.1', port: 3141565 }, true, 'dummy');
  }, 'Invalid parameters (7; invalid port number in socketAddress)');

  assert.throws(() => {
    ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'nonsense', 'dummy');
  }, 'Invalid parameters (8; invalid useSsl parameter)');

  assert.throws(() => {
    ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true);
  }, 'Invalid parameters (9; missing session token parameter)');

  assert.throws(() => {
    ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 1);
  }, 'Invalid parameters (10; invalid session token parameter type)');

  assert.throws(() => {
    ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, '');
  }, 'Invalid parameters (11; empty session token parameter type)');

  assert.ok((() => {
    let x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 'dummy');
    return (typeof x === 'object');
  })(), 'Valid function call (1; SSL enabled, missing ID)');

  assert.ok((() => {
    let x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, false, 'dummy');
    return (typeof x === 'object');
  })(), 'Valid function call (2; SSL disabled, missing ID)');

  assert.ok((() => {
    let x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 'dummy', '');
    return (typeof x === 'object');
  })(), 'Valid function call (3; SSL enabled, empty ID)');

  assert.ok((() => {
    let x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 'dummy', 'dummy');
    return (typeof x === 'object');
  })(), 'Valid function call (4; SSL enabled, non-empty ID)');
});


test('getId function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(2);

  assert.ok((() => {
    const ip = '127.0.0.1';
    const x = ViSenseSystem({ ip: ip, port: 80 }, true, 'dummy');

    return (x.getId() === ip);
  })(), 'ID is set to IP-address when left out during construction');

  assert.ok((() => {
    const id = 'blah';
    const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 'dummy', id);

    return (x.getId() === id);
  })(), 'ID is set to custom ID during construction');
});


test('getProductName function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 'dummy');

    // Check if the returned value is a Promise (the query will fail)
    return (typeof x.getProductName().catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('getServiceTag function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 'dummy');

    // Check if the returned value is a Promise (the query will fail)
    return (typeof x.getServiceTag().catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('getConnectionStatus function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, true, 'dummy');

    // Check if the returned value is a Promise (the query will fail)
    return (typeof x.getConnectionStatus().catch(() => {}) === 'object');
  })(), 'Valid function call');
});
