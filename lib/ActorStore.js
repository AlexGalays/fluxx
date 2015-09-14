'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = ActorStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _dispatcher = require('./dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _noChange = require('./noChange');

var _noChange2 = _interopRequireDefault(_noChange);

/**
* Creates and register a new Actor store.
*/

function ActorStore(factory) {
  var handlerGroups = [{}],
      currentWhenHandlers = undefined,
      dependencies = [];

  function on(action, handler) {
    var handlers = currentWhenHandlers || handlerGroups[0];
    handlers[action.id] = handler;
  }

  function dependOn() {
    for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
      stores[_key] = arguments[_key];
    }

    dependencies = stores;
  }

  function when(condition, registrationFn) {
    currentWhenHandlers = { when: condition };
    handlerGroups.push(currentWhenHandlers);
    registrationFn();
    currentWhenHandlers = null;
  }

  var instance = factory(on, dependOn, when) || {};

  _dispatcher2['default'].register(instance);

  instance._emitter = new _events2['default']();
  instance._name = factory.name || 'ActorStore id=' + instance._id;
  instance._type = 'ActorStore';

  instance._handleAction = function (action, payloads) {

    var groups = handlerGroups.filter(function (group) {
      // This group does not handle that action
      if (!(action.id in group)) return false;

      // This group handles that action but the when condition do not apply
      if (group.when && !group.when()) return false;

      return !group.when || group.when && group.when();
    });

    if (!groups.length) return;

    var changed = groups.reduce(function (changed, group) {
      var handler = group[action.id];
      var handlerResult = undefined;

      // handlers are optional
      if (handler) {
        _dispatcher2['default'].waitFor.apply(null, dependencies);
        handlerResult = handler.apply(null, payloads);
      }

      // If the handler returns anything other than NO_CHANGE,
      // we consider the store did change as a result of the action being handled.
      return handlerResult == _noChange2['default'] ? changed || false : true;
    }, false);

    if (changed !== false) instance._emitter.emit('changed');

    return changed;
  };

  instance.unregister = function () {
    _dispatcher2['default'].unregister(instance);
  };

  return instance;
}

module.exports = exports['default'];