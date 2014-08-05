var Signal     = require('signals').Signal;
var Store      = require('../../src/Store');
var increment  = require('./actions').increment;
var init       = require('./actions').init;
var blueNumber = require('./blueNumber');


var value = 0;
var changed = new Signal();


module.exports = Store({
  changed: changed,
  value: function() { return value },

  actions: [
    init, function(val) {
      value = val;
      changed.dispatch();
    },

    increment, function(offset, waitFor) {
      waitFor(blueNumber);

      value = blueNumber.value();
      changed.dispatch();
    },
  ]
});