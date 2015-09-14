'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _dispatcher = require('./dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

/**
* Calls a function if any of the passed
* stores changed during one dispatcher run.
*/

exports['default'] = function () {
  for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
    stores[_key] = arguments[_key];
  }

  // curried, to separate the stores from the callback.
  return function (callback) {
    var count = 0;

    function inc() {
      count += 1;
    }
    function started() {
      count = 0;
    }
    function stopped() {
      if (count) callback();
    }

    _dispatcher2['default'].on('started', started);
    _dispatcher2['default'].on('stopped', stopped);
    stores.forEach(function (store) {
      return store._emitter.on('changed', inc);
    });

    return function unsub() {
      _dispatcher2['default'].removeListener('started', started);
      _dispatcher2['default'].removeListener('stopped', stopped);
      stores.forEach(function (store) {
        return store._emitter.removeListener('changed', inc);
      });
    };
  };
};

;
module.exports = exports['default'];