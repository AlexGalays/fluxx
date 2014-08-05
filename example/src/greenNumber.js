var Signal     = require('signals').Signal;
var Store      = require('../../src/Store');
var actions    = require('./actions');
var blueNumber = require('./blueNumber');

var init       = actions.init;
var decrement  = actions.decrement;
var increment  = actions.increment;


var currentOffset = 0;
var changed = new Signal();


module.exports = Store({
  changed: changed,
  value: function() { return blueNumber.value() + currentOffset },

  actions: [
    init, function() {
      changed.dispatch();
    },

    decrement, function(offset) {
      currentOffset -= (10 * offset);
      changed.dispatch();
    },

    increment, function(offset) {
      currentOffset += (10 * offset);
      changed.dispatch();
    },
  ]
});