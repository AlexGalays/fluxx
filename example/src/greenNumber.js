import Store from '../../src/Store';
import { init, decrement, increment } from './actions';


export default Store({
  name: 'green',

  state: 0,

  handlers: {
    [init]: (state, val) => val,
    [increment]: (state, offset) => state + 10 * offset,
    [decrement]: (state, offset) => state - 10 * offset
  }
});