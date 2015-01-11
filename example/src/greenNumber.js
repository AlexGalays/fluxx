var Store      = require('../../src/Store');
var actions    = require('./actions');
var blueNumber = require('./blueNumber');

var init       = actions.init;
var decrement  = actions.decrement;
var increment  = actions.increment;


module.exports = Store(function(on, waitFor) {

  var currentOffset = 0;

  on(init, function() {
    // noop; green depends on blue; so whenever blue changes, green does too.
  });

  on(decrement, function(offset) {
    currentOffset -= (10 * offset);
  });

  on(increment, function(offset) {
    currentOffset += (10 * offset);
  });

  return {
    value: function() { return blueNumber.value() + currentOffset }
  };
});