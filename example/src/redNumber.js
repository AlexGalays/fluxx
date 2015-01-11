var Store      = require('../../src/Store');
var increment  = require('./actions').increment;
var init       = require('./actions').init;
var blueNumber = require('./blueNumber');


module.exports = Store(function(on, waitFor) {

  var value = 0;

  on(init, function(val) {
    value = val;
  });

  on(increment, function(offset) {
    waitFor(blueNumber);
    value = blueNumber.value();
  });

  return {
    value: function() { return value }
  };
});