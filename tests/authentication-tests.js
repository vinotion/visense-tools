'use strict';

let Authentication = require('../lib/authentication'),
    expect         = require('expect');


// --------------------------------------------------------------------------------------
QUnit.module('Authentication static tests');

test('Factory function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(9);

    throws(() =>
      {
        Authentication();
      }, 'No parameters');

    throws(() =>
      {
        Authentication(1);
      }, 'Invalid parameters (1; invalid socketAddress object (1))');

    throws(() =>
      {
        Authentication({});
      }, 'Invalid parameters (2; invalid socketAddress object (2))');

    throws(() =>
      {
        Authentication({ ip: '127.0.0.1' });
      }, 'Invalid parameters (3; missing port number in socketAddress)');

    throws(() =>
      {
        Authentication({ port: 80 });
      }, 'Invalid parameters (4; missing IP-address in socketAddress)');

    throws(() =>
      {
        Authentication({ ip: '', port: 80 });
      }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

    throws(() =>
      {
        Authentication({ ip: '127.0.0.1', port: '' });
      }, 'Invalid parameters (6; invalid port number type in socketAddress)');

    throws(() =>
      {
        Authentication({ ip: '127.0.0.1', port: 3141565 });
      }, 'Invalid parameters (7; invalid port number in socketAddress)');

    ok((() =>
      {
        let x = Authentication({ ip: '127.0.0.1', port: 80 });
        return (typeof x === 'object');
      })(), 'Valid function call');
  });


test('signIn function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(6);

    // Test fixture
    const x = Authentication({ ip: '127.0.0.1', port: 80 });

    throws(() =>
      {
        x.signIn();
      }, 'No parameters');

    throws(() =>
      {
        x.signIn(1);
      }, 'Invalid parameters (1; invalid credentials object (1))');

    throws(() =>
      {
        x.signIn({});
      }, 'Invalid parameters (2; invalid credentials object (2))');

    throws(() =>
      {
        x.signIn({ username: 'admin' });
      }, 'Invalid parameters (3; missing password in credentials)');

    throws(() =>
      {
        x.signIn({ password: '' });
      }, 'Invalid parameters (4; missing username in credentials)');

    ok((() =>
      {
        // Check if the returned value is a Promise (the signIn action will fail)
        return (typeof x.signIn({ username: 'dsfnjskjn3', password: 'kjfuisqh3' }).then === 'function');
      })(), 'Valid function call');
  });


test('signOut function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(2);

    // Test fixture
    const x = Authentication({ ip: '127.0.0.1', port: 80 });

    throws(() =>
      {
        x.signOut();
      }, 'No previous session token acquired');

    // Set fake session token
    x.setSessionToken('snafu');

    ok((() =>
      {
        // Check if the returned value is a Promise (the signOut action will fail)
        return (typeof x.signOut().then === 'function');
      })(), 'Valid function call');
  });


test('verify function', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(1);

    // Test fixture
    const x = Authentication({ ip: '127.0.0.1', port: 80 });

    ok((() =>
      {
        // Check if the returned value is a Promise (the verify action will fail)
        return (typeof x.verify().then === 'function');
      })(), 'Valid function call');
  });


test('{get,set}SessionToken functions', () =>
  {
    // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails)
    expect(2);

    // Test fixture
    const x = Authentication({ ip: '127.0.0.1', port: 80 });

    ok((() =>
      {
        return (x.getSessionToken() === '');
      })(), 'Session token empty if not signed in');

    // Set fake session token
    x.setSessionToken('snafu');

    ok((() =>
      {
        return (x.getSessionToken() === 'snafu');
      })(), 'Session token set properly');
  });
