import EventEmitter from 'events';
import dispatcher from './dispatcher';

/**
* Creates and register a new store.
*/
export default function Store(options) {

  var { handlers, name, state, dependOn } = options;
  var dependencies = dependOn ? [].concat(dependOn) : [];
  var instance = { state };

  dispatcher.register(instance);

  instance._emitter = new EventEmitter;
  instance._name = name || `Store id=${instance._id}`;
  instance._type = 'Store';

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