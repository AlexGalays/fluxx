import Store from '../../src/Store';
import { init, decrement, increment } from './actions';


export default Store({
  name: 'blue',

  state: 0,

  handlers: {
    [init]: (state, val) => val,
    [decrement]: (state, offset) => state - offset,
    [increment]: (state, offset) => state + offset
  }
});