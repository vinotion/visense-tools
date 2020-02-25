'use strict';

const WebSocketConnection = require('../lib/websocket-connection');


// --------------------------------------------------------------------------------------
QUnit.module('WebSocketConnection static tests');

test('Factory function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(15);

  assert.throws(() => {
    WebSocketConnection();
  }, 'No parameters');

  assert.throws(() => {
    WebSocketConnection(1, true, 'dummy', 'dummy');
  }, 'Invalid parameters (1; invalid socketAddress object (1))');

  assert.throws(() => {
    WebSocketConnection({}, true, 'dummy', 'dummy');
  }, 'Invalid parameters (2; invalid socketAddress object (2))');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1' }, true, 'dummy', 'dummy');
  }, 'Invalid parameters (3; missing port number in socketAddress)');

  assert.throws(() => {
    WebSocketConnection({ port: 80 }, true, 'dummy', 'dummy');
  }, 'Invalid parameters (4; missing IP-address in socketAddress)');

  assert.throws(() => {
    WebSocketConnection({ ip: '', port: 80 }, true, 'dummy', 'dummy');
  }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1', port: '' }, true, 'dummy', 'dummy');
  }, 'Invalid parameters (6; invalid port number type in socketAddress)');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1', port: 3141565 }, true, 'dummy', 'dummy');
  }, 'Invalid parameters (7; invalid port number in socketAddress)');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'nonsense', 'dummy', 'dummy');
  }, 'Invalid parameters (8; invalid useSsl parameter)');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, '', 'dummy');
  }, 'Invalid parameters (9; empty URL parameter)');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, 'dummy');
  }, 'Invalid parameters (10; missing session token parameter)');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, 'dummy', 1);
  }, 'Invalid parameters (11; invalid session token parameter type)');

  assert.throws(() => {
    WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, 'dummy', '');
  }, 'Invalid parameters (12; empty session token parameter type)');

  assert.ok((() => {
    let x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, 'dummy', 'dummy');
    return (typeof x === 'object');
  })(), 'Valid function call (SSL enabled)');

  assert.ok((() => {
    let x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, false, 'dummy', 'dummy');
    return (typeof x === 'object');
  })(), 'Valid function call (SSL disabled)');
});


test('open function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.ok((() => {
    const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, 'dummy', 'dummy');

    // Check if the returned value is a Promise (the call will fail).
    return (typeof x.open().catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('send function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.throws(() => {
    const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, 'dummy', 'dummy');

    // Websocket is not open, method will throw.
    x.send('', null);
  }, 'Send query when the WebSocketConnection is not opened yet');
});


test('close function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  assert.throws(() => {
    const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, true, 'dummy', 'dummy');

    // Websocket is not open, method will throw.
    x.close()
  }, 'Close when the WebSocket connection is not opened yet');
});
