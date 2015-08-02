'use strict';

var dispatcher = require('./dispatcher');

/**
* Calls a function if any of the passed
* stores changed during one dispatcher run.
*/
module.exports = function() {
  var stores = arguments;

  // curried, to separate the stores from the callback.
  return function(callback) {
    var count = 0;

    function inc() { count += 1 }
    function started() { count = 0 }
    function stopped() { if (count) callback() }

    for (var i = 0; i < stores.length; i++) {
      stores[i]._emitter.on('changed', inc);
    }

    dispatcher.on('started', started);
    dispatcher.on('stopped', stopped);

    return function unsub() {
      dispatcher.removeListener('started', started);
      dispatcher.removeListener('stopped', stopped);

      for (var i = 0; i < stores.length; i++) {
        stores[i]._emitter.removeListener('changed', inc);
      }
    }
  };
};