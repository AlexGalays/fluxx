import EventEmitter from 'events';
import dispatcher from './dispatcher';

/**
* Creates and register a new store.
*/
export default function Store(options) {

  let { handlers, name, state, dependOn } = options;
  let dependencies = dependOn ? [].concat(dependOn) : [];
  let instance = { state };

  dispatcher.register(instance);

  instance._emitter = new EventEmitter;
  instance._name = name || `Store id=${instance._id}`;
  instance._type = 'Store';

  instance._handleAction = function(action, payloads) {
    let handler = handlers[action.id];
    if (!handler) return;

    dispatcher.waitFor.apply(null, dependencies);
    instance.state = handler.apply(null, [instance.state].concat(payloads));

    instance._emitter.emit('changed');

    return true;
  };

  instance.unregister = function() {
    dispatcher.unregister(instance);
  };

  return instance;
}


Store.byName = dispatcher.getRegisteredStoreByName;