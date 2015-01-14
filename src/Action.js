'use strict';

var invariant  = require('./invariant');
var dispatcher = require('./dispatcher');


var names = {};

/**
* Creates an unique action for a name.
* The action can then be used to dispatch a payload.
*
* Ex: 
* var ClickThread = Action('clickThread'); // Create the action once
* ClickThread(id); // Dispatch a payload any number of times
*
*/
function Action(name) {
  invariant(!names[name],
    'An action with the name %s was already created',
    name
  );

  names[name] = name;

  function dispatch(payload) {
    dispatcher.dispatch(name, payload);
  }

  dispatch.toString = function() { return name };

  return dispatch;
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