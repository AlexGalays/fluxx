var assert     = require('better-assert'),
    fluxx      = require('../fluxx'),
    Store      = fluxx.Store,
    Action     = fluxx.Action;


const createActions = function() {
  return [].slice.call(arguments).reduce(function(obj, name) {
    obj[name] = Action(name);
    return obj;
  }, {});
};

suite('fluxx', function() {

  test('Store', function() {

    var fired = 0;
    var caughtError = false;
    var action = createActions('increment', 'decrement', 'noop', 'ignored');

    function makeStore() {
      var handlers = {};

      handlers[action.increment] = function(counter, by) { return counter + by };
      handlers[action.decrement] = function(counter, by) { return counter - by };
      handlers[action.noop]      = function(counter) { return counter };

      return Store({
        state: 0,
        handlers: handlers
      });
    }

    function log() {
      fired++;
    }

    var store = makeStore();

    var unsub = store.subscribe(log);

    action.increment(10);

    assert(fired == 1);
    assert(store.state == 10);

    // Unhandled actions do not trigger a change event
    try {
      action.ignored();
    }
    catch(e) {
      caughtError = true;
    }

    assert(caughtError);
    assert(fired == 1);
    assert(store.state == 10);
    caughtError = false;

    // Noop action
    action.noop();
    assert(fired == 1);
    assert(store.state == 10);

    // Decrement
    action.decrement(5);
    assert(fired == 2);
    assert(store.state == 5);

    unsub();

    action.increment(15);
    assert(fired == 2);
    assert(store.state == 20);
  });


  test('Store with an Array state', function() {
    var action = createActions('init', 'push');

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

});
