import { stores } from './Store';

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

    Object.keys(stores).forEach(id => {
      const store = stores[id];
      // A previous handler may have resulted in another store's disposal
      if (!store) return;
      store._handleAction(action, payloads)
    });
  }

  action._id = id++;
  action._name = name;

  // Allows Actions to be used as Object keys with the correct behavior
  action.toString = () => action._id;

  return action;
}
