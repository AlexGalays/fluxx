/** @jsx React.DOM */

var React       = require('react');
var blueNumber  = require('./blueNumber');
var greenNumber = require('./greenNumber');
var redNumber   = require('./redNumber');
var App         = require('./App');
var init        = require('./actions').init;
var onChange    = require('../../src/Store').onChange;


function render() {
  console.log('render');

  return React.renderComponent(
    <App 
      blueNumber={blueNumber.value()} 
      greenNumber={greenNumber.value()} 
      redNumber={redNumber.value()} />,

    document.querySelector('body')
  );
}

onChange(blueNumber, greenNumber, redNumber)(render);

init(10);