'use strict';


var EventEmitter = require('events');
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
  instance._emitter = new EventEmitter;
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
        instance._emitter.emit('changed');
        return true;
      }
      else return false;
    }
  };

  instance.unregister = function() {
    dispatcher.unregister(instance);
  };

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
      stores[i]._emitter.on('changed', inc);
    }

    dispatcher.on('started', started);
    dispatcher.on('stopped', stopped);

    return function unsub() {
      dispatcher.removeListener('started', started);
      dispatcher.removeListener('stopped', stopped);

      for (var i = 0; i < stores.length; i++) {
        stores[i]._emitter.removeListener('changed', inc);
      }
    }
  };
};


module.exports = Store;