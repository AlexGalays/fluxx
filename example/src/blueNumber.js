import Store from '../../src/Store';
import { init, decrement, increment } from './actions';


export default Store({
  name: 'blueNumber',

  state: 0,

  handlers: {
    [init]: (state, val) => val,
    [decrement]: (state, offset) => state - offset,
    [increment]: (state, offset) => state + offset
  }
});