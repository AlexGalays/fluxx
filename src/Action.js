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
*/
function Action(name) {

  invariant(!names[name],
    'An action with the name %s already exists',
    name
  );

  function dispatch(payload) {
    dispatcher.dispatch(name, payload);
  }

  dispatch.toString = function() { return name };

  return dispatch;
}


module.exports = Action;