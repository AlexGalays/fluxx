'use strict';


var Signal     = require('signals').Signal;
var dispatcher = require('./dispatcher');


/**
* Creates and register a new store.
*/
function Store(factory) {
  var handlers = {},
      dependencies = [],
      waitFor;

  function on(action, handler) {
    handlers[action.id] = handler;
  }

  function dependOn() {
    dependencies = [].slice.call(arguments);
  }

  var instance = factory(on, dependOn) || {};
  instance._name = factory.name || '[no name]';

  dispatcher.register(instance);

  instance._handleAction = function(action, payloads) {
    var handler, result;

    // If this store subscribed to that action
    if (action.id in handlers) {
      handler = handlers[action.id];

      // handlers are optional
      if (handler) {
        dispatcher.waitFor.apply(null, dependencies);
        result = handler.apply(null, payloads);
      }

      if (result !== false) {
        instance.changed.dispatch();
        return true;
      }
      else return false;
    }
  };

  instance.unregister = function() {
    dispatcher.unregister(instance);
  };

  instance.changed = new Signal();

  return instance;
}

/**
* Calls a function if any of the passed
* stores changed during one dispatcher run.
*/
Store.onChange = function() {
  var stores = arguments;

  // curried, to separate the stores from the callback.
  return function(callback) {
    var count = 0;

    function inc() { count += 1 }
    function started() { count = 0 }
    function stopped() { if (count) callback() }

    for (var i = 0; i < stores.length; i++) {
      stores[i].changed.add(inc);
    }

    dispatcher.started.add(started);
    dispatcher.stopped.add(stopped);

    return function unsub() {
      dispatcher.started.remove(started);
      dispatcher.stopped.remove(stopped);

      for (var i = 0; i < stores.length; i++) {
        stores[i].changed.remove(inc);
      }
    }
  };
};


module.exports = Store;