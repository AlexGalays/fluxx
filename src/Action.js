'use strict';

var dispatcher = require('./dispatcher');


var id = 1;

/**
* Creates an unique action for a name.
* The action can then be used to dispatch a payload.
*
* Ex: 
* var ClickThread = Action('clickThread'); // Create the action once
* ClickThread(id); // Dispatch a payload any number of times
*/
function Action(name) {

  function action() {
    var payloads = [].slice.call(arguments);
    dispatcher.dispatch(action, payloads);
  }

  action.toString = function() { return name };
  action.id = id++;

  return action;
}

/**
* Creates one or more actions, exposed by name in an object (useful to assign to module.exports)
* var actions = Action.create('clickThread', 'scroll');
*/
Action.create = function() {
  return [].slice.call(arguments).reduce(function(obj, name) {
    obj[name] = Action(name);
    return obj;
  }, {});
};


module.exports = Action;