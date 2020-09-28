'use strict';

const Authentication = require('../lib/authentication');
const { test } = QUnit;

// --------------------------------------------------------------------------------------
QUnit.module('Authentication unit tests');

test('Factory function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(12);

  assert.throws(() => {
    Authentication();
  }, 'No parameters');

  assert.throws(() => {
    Authentication(1, true);
  }, 'Invalid parameters (1; invalid socketAddress object (1))');

  assert.throws(() => {
    Authentication({}, true);
  }, 'Invalid parameters (2; invalid socketAddress object (2))');

  assert.throws(() => {
    Authentication({ ip: '127.0.0.1' }, true);
  }, 'Invalid parameters (3; missing port number in socketAddress)');

  assert.throws(() => {
    Authentication({ port: 80 }, true);
  }, 'Invalid parameters (4; missing IP-address in socketAddress)');

  assert.throws(() => {
    Authentication({ ip: '', port: 80 }, true);
  }, 'Invalid parameters (5; invalid IP-address in socketAddress)');

  assert.throws(() => {
    Authentication({ ip: '127.0.0.1', port: '' }, true);
  }, 'Invalid parameters (6; invalid port number type in socketAddress)');

  assert.throws(() => {
    Authentication({ ip: '127.0.0.1', port: 3141565 }, true);
  }, 'Invalid parameters (7; invalid port number in socketAddress)');

  assert.throws(() => {
    Authentication({ ip: '127.0.0.1', port: 80 });
  }, 'Invalid parameters (8; missing useSsl parameter)');

  assert.throws(() => {
    Authentication({ ip: '127.0.0.1', port: 80 }, 'nonsense');
  }, 'Invalid parameters (9; invalid useSsl parameter)');

  assert.ok((() => {
    const x = Authentication({ ip: '127.0.0.1', port: 80 }, true);
    return (typeof x === 'object');
  })(), 'Valid function call (SSL enabled)');

  assert.ok((() => {
    const x = Authentication({ ip: '127.0.0.1', port: 80 }, false);
    return (typeof x === 'object');
  })(), 'Valid function call (SSL disabled)');
});


test('signIn function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(6);

  // Test fixture.
  const x = Authentication({ ip: '127.0.0.1', port: 80 }, true);

  assert.throws(() => {
    x.signIn();
  }, 'No parameters');

  assert.throws(() => {
    x.signIn(1);
  }, 'Invalid parameters (1; invalid credentials object (1))');

  assert.throws(() => {
    x.signIn({});
  }, 'Invalid parameters (2; invalid credentials object (2))');

  assert.throws(() => {
    x.signIn({ username: 'admin' });
  }, 'Invalid parameters (3; missing password in credentials)');

  assert.throws(() => {
    x.signIn({ password: '' });
  }, 'Invalid parameters (4; missing username in credentials)');

  assert.ok((() => {
    // Check if the returned value is a Promise (the signIn action will fail).
    return (typeof x.signIn({ username: 'dsfnjskjn3', password: 'kjfuisqh3' }).catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('signOut function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(2);

  // Test fixture.
  const x = Authentication({ ip: '127.0.0.1', port: 80 }, true);

  assert.throws(() => {
    x.signOut();
  }, 'No previous session token acquired');

  // Set fake session token.
  x.setSessionToken('nonsense');

  assert.ok((() => {
    // Check if the returned value is a Promise (the signOut action will fail).
    return (typeof x.signOut().catch(() => {}) === 'object');
  })(), 'Valid function call');
});


test('verify function', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(1);

  // Test fixture.
  const x = Authentication({ ip: '127.0.0.1', port: 80 }, true);

  assert.ok((() => {
      // Check if the returned value is a Promise (the verify action will fail).
      return (typeof x.verify().catch(() => {}) === 'object');
    })(), 'Valid function call');
});


test('{get,set}SessionToken functions', (assert) => {

  // Tell QUnit to expect a fixed number of assertions (to prevent missing silent fails).
  assert.expect(2);

  // Test fixture.
  const x = Authentication({ ip: '127.0.0.1', port: 80 }, true);

  assert.ok((() => {
    return (x.getSessionToken() === '');
  })(), 'Session token empty if not signed in');

  // Set fake session token.
  x.setSessionToken('nonsense');

  assert.ok((() => {
    return (x.getSessionToken() === 'nonsense');
  })(), 'Session token set properly');
});
