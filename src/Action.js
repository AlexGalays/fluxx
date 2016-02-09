import { instance } from './Store';

// Unique Action ids.
// This removes the need to provide unique names across the whole application.
let id = 1;

/**
* Creates an unique action for a name.
* The name is only useful for debugging purposes; different actions can have the same name.
* The returned action function can then be used to dispatch one or more payloads.
*
* Ex:
* var ClickThread = Action('clickThread'); // Create the action once
* ClickThread(id); // Dispatch a payload any number of times
*/
export default function Action(name) {

  // The actual action dispatch function
  function action() {
    let payloads = [].slice.call(arguments);

    const store = instance();
    if (!store)
      throw new Error(`Tried to dispatch an action ($name) without an instanciated store`);

    store._handleAction(action, payloads);
  }

  action._id = id++;
  action._name = name;

  // Allows Actions to be used as Object keys with the correct behavior
  action.toString = () => action._id;

  return action;
}
