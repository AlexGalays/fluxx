var assert     = require('better-assert'),
    fluxx      = require('../fluxx'),
    onChange   = fluxx.onChange,
    NO_CHANGE  = fluxx.NO_CHANGE,
    Store      = fluxx.Store,
    ActorStore = fluxx.ActorStore,
    Action     = fluxx.Action;


//fluxx.enableLogs();

suite('fluxx', function() {

  test('Store', function() {

    var fired = 0;
    var action = Action.create('increment', 'decrement', 'noop', 'ignored');

    function makeStore(name) {
      var handlers = {};

      handlers[action.increment] = function(counter, by) { return counter + by };
      handlers[action.decrement] = function(counter, by) { return counter - by };
      handlers[action.noop]      = function(counter) { return counter };

      return Store({
        state: 0,
        name: name,
        handlers: handlers
      });
    }

    function log() {
      fired++;
    }

    var store1 = makeStore('store1');
    var store2 = makeStore('store2');

    var unsub = onChange(store1, store2)(log);

    assert(Store.byName('store1') === store1);
    assert(Store.byName('store2') === store2);
    assert(Store.byName('store3') === undefined);

    action.increment(10);

    // onChange batches updates
    assert(fired == 1);
    assert(store1.state == 10);
    assert(store2.state == 10);

    // Unhandled actions do not trigger a change event
    action.ignored();
    assert(fired == 1);
    assert(store1.state == 10);
    assert(store2.state == 10);

    // Noop action
    action.noop();
    assert(fired == 2);
    assert(store1.state == 10);
    assert(store2.state == 10);

    // Decrement
    action.decrement(5);
    assert(fired == 3);
    assert(store1.state == 5);
    assert(store2.state == 5);

    unsub();
    action.increment(15);
    assert(fired == 3);
    assert(store1.state == 20);
    assert(store2.state == 20);

    // Manually subscribing to store1 (just testing the store is still active)
    store1._emitter.on('changed', function() {
      fired++;
    });

    action.increment(0);
    assert(fired == 4);

    store1.unregister();

    assert(Store.byName('store1') === undefined);
    assert(Store.byName('store2') === store2);

    store2.unregister();
    action.increment(0);
    assert(fired == 4);
  });


  test('Store with an Array state', function() {
    var action = Action.create('init', 'push');

    function makeStore() {
      var handlers = {};

      handlers[action.init] = function() { return [] };
      handlers[action.push] = function(arr, item) {
        var clone = arr.slice();
        clone.push(item);
        return clone;
      };

      return Store({
        handlers: handlers
      });
    }

    var store = makeStore();
    action.init();
    action.push([1, 2, 3]);

    assert(store.state.length == 1);
    assert(store.state[0].length == 3);
  });


  test('ActorStore', function() {

    var fired = 0;
    var action = Action.create('fire', 'missfire', 'ignored', 'not_ignored');

    function makeStore() {
      return ActorStore(function(on) {
        on(action.fire);
        on(action.ignored, function() { return NO_CHANGE });
        on(action.not_ignored, function() { return false })
      });
    }

    function log() {
      fired++;
    }

    var store1 = makeStore();
    var store2 = makeStore();

    var unsub = onChange(store1, store2)(log);

    action.fire();

    // onChange batches updates
    assert(fired == 1);

    // Unrelated actions do not trigger a change event
    action.missfire();
    assert(fired == 1);

    // Actions returning NO_CHANGE do not trigger a change event
    action.ignored();
    assert(fired == 1);

    // Actions returning false do trigger a change event
    action.not_ignored();
    assert(fired == 2);

    unsub();
    action.fire();
    assert(fired == 2);

    // Manually subscribing to store1 (just testing the store is still active)
    store1._emitter.on('changed', function() {
      fired++;
    });

    action.fire();
    assert(fired == 3);

    store1.unregister();
    store2.unregister();
    action.fire();
    assert(fired == 3);
  });


  test('ActorStore as a state machine', function() {

    var run = 0;
    var batteryChecks = 0;

    var action = Action.create('run', 'activate', 'deactivate', 'check_battery');

    var store = ActorStore(function(on, _, when) {

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