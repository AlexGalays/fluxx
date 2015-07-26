var assert = require('better-assert'),
    fluxx  = require('./src/fluxx'),
    Store  = fluxx.Store,
    Action = fluxx.Action;


suite('fluxx', function() {

  test('Store.onChange', function() {

    var fired = 0;
    var action = Action.create('fire');

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

});   