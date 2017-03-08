'use strict';

let ViSenseSystem = require('../lib/visense-system');


// --------------------------------------------------------------------------------------
QUnit.module('ViSenseSystem static tests');

test('Factory function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(14);

    throws(() =>
      {
        ViSenseSystem();
      }, 'No parameters');

    throws(() =>
      {
        ViSenseSystem(1, 'dummy');
      }, 'Invalid parameters (1; invalid socketAddress object (1))');

    throws(() =>
      {
        ViSenseSystem({}, 'dummy');
      }, 'Invalid parameters (2; invalid socketAddress object (2))');

    throws(() =>
      {
        ViSenseSystem({ ip: '127.0.0.1' }, 'dummy');
      }, 'Invalid parameters (3; missing port number in socketAddress)');

    throws(() =>
      {
        ViSenseSystem({ port: 80 }, 'dummy');
      }, 'Invalid parameters (4; missing IP-address in socketAddress)');

    throws(() =>
      {
        ViSenseSystem({ ip: '', port: 80 }, 'dummy');
      }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

    throws(() =>
      {
        ViSenseSystem({ ip: '127.0.0.1', port: '' }, 'dummy');
      }, 'Invalid parameters (6; invalid port number type in socketAddress)');

    throws(() =>
      {
        ViSenseSystem({ ip: '127.0.0.1', port: 3141565 }, 'dummy');
      }, 'Invalid parameters (7; invalid port number in socketAddress)');

    throws(() =>
      {
        ViSenseSystem({ ip: '127.0.0.1', port: 80 });
      }, 'Invalid parameters (8; missing session token parameter)');

    throws(() =>
      {
        ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 1);
      }, 'Invalid parameters (9; invalid session token parameter type)');

    throws(() =>
      {
        ViSenseSystem({ ip: '127.0.0.1', port: 80 }, '');
      }, 'Invalid parameters (10; empty session token parameter type)');

    ok((() =>
      {
        let x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'dummy');
        return (typeof x === 'object');
      })(), 'Valid function call (1; missing ID)');

    ok((() =>
      {
        let x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'dummy', '');
        return (typeof x === 'object');
      })(), 'Valid function call (2; empty ID)');

    ok((() =>
      {
        let x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'dummy', 'dummy');
        return (typeof x === 'object');
      })(), 'Valid function call (3; non-empty ID)');
  });


test('getId function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(2);

    ok((() =>
      {
        const ip = '127.0.0.1';
        const x = ViSenseSystem({ ip: ip, port: 80 }, 'dummy');

        return (x.getId() === ip);
      })(), 'ID is set to IP-address when left out during construction');

    ok((() =>
      {
        const id = 'blah';
        const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'dummy', id);

        return (x.getId() === id);
      })(), 'ID is set to custom ID during construction');
  });


test('queryProductName function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    ok((() =>
      {
        const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'dummy');

        // Check if the returned value is a Promise (the query will fail)
        return (typeof x.queryProductName().then === 'function');
      })(), 'Valid function call');
  });


test('queryServiceTag function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    ok((() =>
      {
        const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'dummy');

        // Check if the returned value is a Promise (the query will fail)
        return (typeof x.queryServiceTag().then === 'function');
      })(), 'Valid function call');
  });


test('queryConnectionStatus function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    ok((() =>
      {
        const x = ViSenseSystem({ ip: '127.0.0.1', port: 80 }, 'dummy');

        // Check if the returned value is a Promise (the query will fail)
        return (typeof x.queryConnectionStatus().then === 'function');
      })(), 'Valid function call');
  });
