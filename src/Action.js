import Store, { globalStore, localStores } from './Store';

// Unique Action ids.
// This removes the need to provide unique names across the whole application.
let id = 1;

/**
* Creates an unique action for a name.
* The name is only useful for debugging purposes; different actions can have the same name.
* The returned action function can then be used to dispatch one or more payloads.
*
* Ex:
* var clickThread = Action('clickThread'); // Create the action once
* clickThread(id); // Dispatch a payload any number of times
*/
export default function Action(name) {

  // The actual action dispatch function
  function action() {
    let payloads = [].slice.call(arguments);

    const isGlobalAction = action._store === undefined;

    // Dispatch to our local store if we were given one or default to the global store.
    const store = isGlobalAction ? globalStore() : action._store;

    if (!store)
      throw new Error(`Tried to dispatch an action (${action._name}) without an instanciated store`);

    store._handleAction(action, payloads);

    // Give a chance to all local Stores to react to this global Action
    if (isGlobalAction) {
      Object.keys(localStores).forEach(id =>
        localStores[id]._handleAction(action, payloads));
    }
  }

  action._id = id++;
  action._name = name;

  // Allows Actions to be used as Object keys with the correct behavior
  action.toString = () => action._id;

  return action;
}
