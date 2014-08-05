/** @jsx React.DOM */

var React       = require('react');
var blueNumber  = require('./blueNumber');
var greenNumber = require('./greenNumber');
var redNumber   = require('./redNumber');
var App         = require('./App');
var init        = require('./actions').init;
var Store       = require('../../src/Store');


function render() {
  return React.renderComponent(
    <App 
      blueNumber={blueNumber.value()} 
      greenNumber={greenNumber.value()} 
      redNumber={redNumber.value()} />,

    document.querySelector('body')
  );
}

Store.when(
  blueNumber.changed,
  greenNumber.changed,
  redNumber.changed
)
.add(render);

init(10);