'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcher = require('./dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _Action = require('./Action');

var _Action2 = _interopRequireDefault(_Action);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

var _ActorStore = require('./ActorStore');

var _ActorStore2 = _interopRequireDefault(_ActorStore);

var _onChange = require('./onChange');

var _onChange2 = _interopRequireDefault(_onChange);

var _noChange = require('./noChange');

var _noChange2 = _interopRequireDefault(_noChange);

exports['default'] = {
  Action: _Action2['default'],
  Store: _Store2['default'],
  ActorStore: _ActorStore2['default'],
  onChange: _onChange2['default'],
  NO_CHANGE: _noChange2['default'],

  enableLogs: function enableLogs(verbosity) {
    return _dispatcher2['default'].log = verbosity || true;
  }
};
module.exports = exports['default'];