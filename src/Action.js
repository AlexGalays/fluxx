import dispatcher from './dispatcher';


var id = 1;

/**
* Creates an unique action for a name.
* The name is only here for debugging purposes, different actions can have the same name.
* The action can then be used to dispatch a payload.
*
* Ex: 
* var ClickThread = Action('clickThread'); // Create the action once
* ClickThread(id); // Dispatch a payload any number of times
*/
export default function Action(name) {

  function action() {
    var payloads = [].slice.call(arguments);
    dispatcher.dispatch(action, payloads);
  }

  action.id = id++;
  action._name = name;
  action.toString = function() { return action.id };
  
  return action;
}

/**
* Creates one or more actions, exposed by name in an object (useful to assign to module.exports)
* var actions = Action.create('clickThread', 'scroll');
*/
Action.create = function() {
  return [].slice.call(arguments).reduce((obj, name) => {
    obj[name] = Action(name);
    return obj;
  }, {});
};