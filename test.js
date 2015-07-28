var assert = require('better-assert'),
    fluxx  = require('./src/fluxx'),
    Store  = fluxx.Store,
    Action = fluxx.Action;


suite('fluxx', function() {

  test('Store.onChange', function() {

    var fired = 0;
    var action = Action.create('fire', 'missfire');

    function makeStore() {
      return Store(function(on) {
        on(action.fire)
      });
    }

    function log() {
      fired++;
    }

    var store1 = makeStore();
    var store2 = makeStore();

    var unsub = Store.onChange(store1, store2)(log);

    action.fire();

    // onChange batches updates
    assert(fired == 1);

    // Unrelated actions do not trigger a change event
    action.missfire();
    assert(fired == 1);

    unsub();
    action.fire();
    assert(fired == 1);

    // Manually subscribing to store1
    store1._emitter.on('changed', function() {
      fired++;
    });

    action.fire();
    assert(fired == 2);
  });


  test('Store as a state machine', function() {

    var run = 0;
    var batteryChecks = 0;

    var action = Action.create('run', 'activate', 'deactivate', 'check_battery');

    var store = Store(function(on, _, when) {

      when(activated, activatedStore);
      when(not(activated), deactivatedStore);

      // Regular action without a condition
      on(action.check_battery, function() {
        batteryChecks++;
      });


      var _activated = false;
      function activated() { return _activated }

      function activatedStore() {
        on(action.run, function() {
          run++;
        });

        on(action.deactivate, function() {
          _activated = false;
        });
      }

      function deactivatedStore() {
        on(action.activate, function() {
          _activated = true;
        });
      }

      return {
        run: function() { return run },
        batteryChecks: function() { return batteryChecks },
        activated: activated
      };
    });

    assert(store.run() == 0);
    assert(store.batteryChecks() == 0);
    assert(!store.activated());

    // The store starts in the deactivated state
    action.check_battery();
    action.run();

    assert(store.batteryChecks() == 1);
    assert(store.run() == 0);
    assert(!store.activated());

    // Transition to the activated state
    action.activate();

    assert(store.batteryChecks() == 1);
    assert(store.run() == 0);
    assert(store.activated());

    action.check_battery();
    action.run();
    action.run();

    assert(store.batteryChecks() == 2);
    assert(store.run() == 2);
    assert(store.activated());

    // Transition back to the deactivated state
    action.deactivate();

    action.check_battery();
    action.run();

    assert(store.batteryChecks() == 3);
    assert(store.run() == 2);
    assert(!store.activated());
  });


});


function not(fn) {
  return function() { return !fn.apply(this, arguments) }
};