'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = Action;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcher = require('./dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

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

function Action(name) {

  function action() {
    var payloads = [].slice.call(arguments);
    _dispatcher2['default'].dispatch(action, payloads);
  }

  action.id = id++;
  action._name = name;
  action.toString = function () {
    return action.id;
  };

  return action;
}

/**
* Creates one or more actions, exposed by name in an object (useful to assign to module.exports)
* var actions = Action.create('clickThread', 'scroll');
*/
Action.create = function () {
  return [].slice.call(arguments).reduce(function (obj, name) {
    obj[name] = Action(name);
    return obj;
  }, {});
};
module.exports = exports['default'];