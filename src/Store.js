'use strict';


var Signal     = require('signals').Signal;
var dispatcher = require('./dispatcher');


/**
* Creates and register a new store.
*/
function Store(factory) {
  var handlers = {};

  function on(action, handler) {
    handlers[action] = handler;
  }

  var instance = factory(on, dispatcher.waitFor);
  dispatcher.register(instance);

  instance._handleAction = function(actionName, payload) {
    if (!handlers[actionName]) return;
    handlers[actionName](payload);
    instance.changed.dispatch();
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
}


module.exports = Store;