import EventEmitter from 'events';
import dispatcher from './dispatcher';
import NO_CHANGE from './noChange';

/**
* Creates and register a new Actor store.
*/
export default function ActorStore(factory) {
  let handlerGroups = [{}],
      currentWhenHandlers,
      dependencies = [];

  function on(action, handler) {
    let handlers = currentWhenHandlers || handlerGroups[0];
    handlers[action.id] = handler;
  }

  function dependOn(...stores) {
    dependencies = stores;
  }

  function when(condition, registrationFn) {
    currentWhenHandlers = { when: condition };
    handlerGroups.push(currentWhenHandlers);
    registrationFn();
    currentWhenHandlers = null;
  }

  let instance = factory(on, dependOn, when) || {};

  dispatcher.register(instance);

  instance._emitter = new EventEmitter;
  instance._name = factory.name || `ActorStore id=${instance._id}`;
  instance._type = 'ActorStore';


  instance._handleAction = function(action, payloads) {

    let groups = handlerGroups.filter(group => {
      // This group does not handle that action
      if (!(action.id in group)) return false;

      // This group handles that action but the when condition do not apply
      if (group.when && !group.when()) return false;

      return !group.when || (group.when && group.when());
    });

    if (!groups.length) return;

    let changed = groups.reduce((changed, group) => {
      let handler = group[action.id];
      let handlerResult;

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