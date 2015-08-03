import React from 'react';
import fluxx from '../../src/fluxx';
import blueNumber from './blueNumber';
import greenNumber from './greenNumber';
import redNumber from './redNumber';
import App from './App';
import { init } from './actions';


function render() {
  console.log('render');

  return React.render(
    <App 
      blueNumber={blueNumber.state} 
      greenNumber={greenNumber.value()} 
      redNumber={redNumber.state}/>,

    document.querySelector('body')
  );
}

fluxx.onChange(blueNumber, greenNumber, redNumber)(render);

fluxx.enableLogs();
init(10);