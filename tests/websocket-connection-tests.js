'use strict';

let WebSocketConnection = require('../lib/websocket-connection');


// --------------------------------------------------------------------------------------
QUnit.module('WebSocketConnection static tests');

test('Factory function', (assert) =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    assert.expect(13);

    assert.throws(() =>
      {
        WebSocketConnection();
      }, 'No parameters');

    assert.throws(() =>
      {
        WebSocketConnection(1, 'dummy', 'dummy');
      }, 'Invalid parameters (1; invalid socketAddress object (1))');

    assert.throws(() =>
      {
        WebSocketConnection({}, 'dummy', 'dummy');
      }, 'Invalid parameters (2; invalid socketAddress object (2))');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1' }, 'dummy', 'dummy');
      }, 'Invalid parameters (3; missing port number in socketAddress)');

    assert.throws(() =>
      {
        WebSocketConnection({ port: 80 }, 'dummy', 'dummy');
      }, 'Invalid parameters (4; missing IP-address in socketAddress)');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '', port: 80 }, 'dummy', 'dummy');
      }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: '' }, 'dummy', 'dummy');
      }, 'Invalid parameters (6; invalid port number type in socketAddress)');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 3141565 }, 'dummy', 'dummy');
      }, 'Invalid parameters (7; invalid port number in socketAddress)');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, '', 'dummy');
      }, 'Invalid parameters (8; empty URL parameter)');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy');
      }, 'Invalid parameters (9; missing session token parameter)');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 1);
      }, 'Invalid parameters (10; invalid session token parameter type)');

    assert.throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', '');
      }, 'Invalid parameters (11; empty session token parameter type)');

    assert.ok((() =>
      {
        let x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');
        return (typeof x === 'object');
      })(), 'Valid function call');
  });


test('open function', (assert) =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    assert.expect(1);

    assert.ok((() =>
      {
        const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');

        // Check if the returned value is a Promise (the call will fail)
        return (typeof x.open().catch(error => {}) === 'object');
      })(), 'Valid function call');
  });


test('send function', (assert) =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    assert.expect(1);

    assert.throws(() =>
      {
        const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');

        // Websocket is not open, method will throw.
        x.send('', null);
      }, 'Send query when the WebSocketConnection is not opened yet');
  });


test('close function', (assert) =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    assert.expect(1);

    assert.ok((() =>
      {
        const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');

        // Check if the returned value is a Promise (the call will not fail)
        return (typeof x.close().then === 'function');
      })(), 'Valid function call');
  });
