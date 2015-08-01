'use strict';


var EventEmitter = require('events');
var dispatcher = require('./dispatcher');
var NO_CHANGE = require('./noChange');

/**
* Creates and register a new store.
*/
function Store(factory) {
  var handlerGroups = [{}],
      currentWhenHandlers,
      dependencies = [],
      waitFor;

  function on(action, handler) {
    var handlers = currentWhenHandlers || handlerGroups[0];
    handlers[action.id] = handler;
  }

  function dependOn() {
    dependencies = [].slice.call(arguments);
  }

  function when(condition, registrationFn) {
    currentWhenHandlers = { when: condition };
    handlerGroups.push(currentWhenHandlers);
    registrationFn();
    currentWhenHandlers = null;
  }

  var instance = factory(on, dependOn, when) || {};
  instance._emitter = new EventEmitter;
  instance._name = factory.name || '[no name]';

  dispatcher.register(instance);

  instance._handleAction = function(action, payloads) {

    var groups = handlerGroups.filter(function(group) {
      // This group does not handle that action
      if (!(action.id in group)) return false;

      // This group handles that action but the when condition do not apply
      if (group.when && !group.when()) return false;

      return !group.when || (group.when && group.when());
    });

    if (!groups.length) return;

    var changed = groups.reduce(function(changed, group) {
      var handler = group[action.id];
      var handlerResult;

      // handlers are optional
      if (handler) {
        dispatcher.waitFor.apply(null, dependencies);
        handlerResult = handler.apply(null, payloads);
      }

      // If the handler returns anything other than NO_CHANGE,
      // we consider the store did change as a result of the action being handled.
      return (handlerResult == NO_CHANGE) ? changed || false : true;

    }, false);

    if (changed !== false)
      instance._emitter.emit('changed');

    return changed;
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