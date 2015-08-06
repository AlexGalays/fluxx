import React from 'react';
import fluxx from '../../src/fluxx';
import Fluxx from '../../src/addon/ReactConnector';
import blueStore from './blueNumber';
import greenStore from './greenNumber';
import redStore from './redNumber';
import App from './App';
import { init } from './actions';


React.render(
  <Fluxx stores={[blueStore, greenStore, redStore]}>{ (blue, green, red) => 
    <App 
      blueNumber={blue}
      greenNumber={green}
      redNumber={red}/>
  }
  </Fluxx>,

  document.querySelector('body')
);


fluxx.enableLogs();
init(10);