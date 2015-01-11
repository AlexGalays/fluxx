var Store     = require('../../src/Store');
var actions   = require('./actions');

var init      = actions.init;
var decrement = actions.decrement;
var increment = actions.increment;


module.exports = Store(function(on, waitFor) {

  var value = 0;

  on(init, function(val) {
    value = val;
  });

  on(decrement, function(offset) {
    value -= offset;
  });

  on(increment, function(offset) {
    value += offset;
  });

  return {
    value: function() { return value }
  };
});