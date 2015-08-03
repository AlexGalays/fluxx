import Store from '../../src/Store';
import blueNumber from './blueNumber';
import { init, decrement, increment } from './actions';


// Matches blue number if blue number is increasing, else noop
export default Store({
  name: 'redNumber',

  state: 0,

  handlers: {
    [init]: (state, val) => val,
    [increment]: (state, offset) => blueNumber.state
  },

  dependOn: blueNumber
});