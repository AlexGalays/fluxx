var Store      = require('../../src/Store');
var actions    = require('./actions');
var blueNumber = require('./blueNumber');

var init       = actions.init;
var decrement  = actions.decrement;
var increment  = actions.increment;


module.exports = Store(function greenNumber(on) {

  var currentOffset = 0;

  on(init);

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