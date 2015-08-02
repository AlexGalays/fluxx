'use strict';


var EventEmitter = require('events');
var dispatcher   = require('./dispatcher');

/**
* Creates and register a new store.
*/
function Store(options) {

  var handlers     = options.handlers,
      name         = options.name,
      dependencies = options.dependOn ? [].concat(options.dependOn) : [],
      instance     = { state: options.state };

  instance._emitter = new EventEmitter;
  instance._name = name || '[no name]';

  dispatcher.register(instance);

  instance._handleAction = function(action, payloads) {
    var handler = handlers[action.id];
    if (!handler) return;

    dispatcher.waitFor.apply(null, dependencies);
    instance.state = handler.apply(null, [].concat(instance.state).concat(payloads));

    instance._emitter.emit('changed');

    return true;
  };

  instance.unregister = function() {
    dispatcher.unregister(instance);
  };

  return instance;
}


module.exports = Store;