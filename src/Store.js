'use strict';


var Signal     = require('signals').Signal;
var dispatcher = require('./dispatcher');


/**
* Creates and register a new store.
*/
function Store(instance) {
  dispatcher.register(instance);

  var actions = instance.actions;
  var handlers = {};
  for (var i = 0; i < actions.length - 1; i += 2) {
    handlers[actions[i]] = actions[i+1];
  }

  instance._handleAction = function(actionName, payload, waitFor) {
    handlers[actionName] && handlers[actionName](payload, waitFor);
  };

  return instance;
}

/**
* Returns a signal that will be sent if any of the passed
* signals are sent during one dispatcher run.
*/
Store.when = function() {
  var signals = arguments;
  var count = 0;
  var startCount;
  var result = new Signal();

  function inc() { count += 1 }
  function started() { startCount = count }
  function stopped() { if (startCount != count) result.dispatch() }

  for (var i = 0; i < signals.length; i++) {
    signals[i].add(inc);
  }

  dispatcher.started.add(started);
  dispatcher.stopped.add(stopped);

  return result;
}


module.exports = Store;