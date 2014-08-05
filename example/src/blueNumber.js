var Signal    = require('signals').Signal;
var Store     = require('../../src/Store');
var actions   = require('./actions');

var init      = actions.init;
var decrement = actions.decrement;
var increment = actions.increment;


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

    decrement, function(offset) {
      value -= offset;
      changed.dispatch();
    },

    increment, function(offset) {
      value += offset;
      changed.dispatch();
    }
  ]
});