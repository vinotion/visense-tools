'use strict';

let WebSocketConnection = require('../lib/websocket-connection');


// --------------------------------------------------------------------------------------
QUnit.module('WebSocketConnection static tests');

test('Factory function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(13);

    throws(() =>
      {
        WebSocketConnection();
      }, 'No parameters');

    throws(() =>
      {
        WebSocketConnection(1, 'dummy', 'dummy');
      }, 'Invalid parameters (1; invalid socketAddress object (1))');

    throws(() =>
      {
        WebSocketConnection({}, 'dummy', 'dummy');
      }, 'Invalid parameters (2; invalid socketAddress object (2))');

    throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1' }, 'dummy', 'dummy');
      }, 'Invalid parameters (3; missing port number in socketAddress)');

    throws(() =>
      {
        WebSocketConnection({ port: 80 }, 'dummy', 'dummy');
      }, 'Invalid parameters (4; missing IP-address in socketAddress)');

    throws(() =>
      {
        WebSocketConnection({ ip: '', port: 80 }, 'dummy', 'dummy');
      }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

    throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: '' }, 'dummy', 'dummy');
      }, 'Invalid parameters (6; invalid port number type in socketAddress)');

    throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 3141565 }, 'dummy', 'dummy');
      }, 'Invalid parameters (7; invalid port number in socketAddress)');

    throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, '', 'dummy');
      }, 'Invalid parameters (8; empty URL parameter)');

    throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy');
      }, 'Invalid parameters (9; missing session token parameter)');

    throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 1);
      }, 'Invalid parameters (10; invalid session token parameter type)');

    throws(() =>
      {
        WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', '');
      }, 'Invalid parameters (11; empty session token parameter type)');

    ok((() =>
      {
        let x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');
        return (typeof x === 'object');
      })(), 'Valid function call');
  });


test('open function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    ok((() =>
      {
        const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');

        // Check if the returned value is a Promise (the call will fail)
        return (typeof x.open().then === 'function');
      })(), 'Valid function call');
  });


test('send function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    throws(() =>
      {
        const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');
        x.send('', null);
      }, 'Send query when the WebSocketConnection is not opened yet');
  });


test('close function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    ok((() =>
      {
        const x = WebSocketConnection({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');

        // Check if the returned value is a Promise (the call will fail)
        return (typeof x.close().then === 'function');
      })(), 'Valid function call');
  });
