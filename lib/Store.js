'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = Store;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _dispatcher = require('./dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

/**
* Creates and register a new store.
*/

function Store(options) {
  var handlers = options.handlers;
  var name = options.name;
  var state = options.state;
  var dependOn = options.dependOn;

  var dependencies = dependOn ? [].concat(dependOn) : [];
  var instance = { state: state };

  _dispatcher2['default'].register(instance);

  instance._emitter = new _events2['default']();
  instance._name = name || 'Store id=' + instance._id;
  instance._type = 'Store';

  instance._handleAction = function (action, payloads) {
    var handler = handlers[action.id];
    if (!handler) return;

    _dispatcher2['default'].waitFor.apply(null, dependencies);
    instance.state = handler.apply(null, [].concat(instance.state).concat(payloads));

    instance._emitter.emit('changed');

    return true;
  };

  instance.unregister = function () {
    _dispatcher2['default'].unregister(instance);
  };

  return instance;
}

module.exports = exports['default'];