import ActorStore from '../../src/ActorStore';
import { init, decrement, increment } from './actions';
import blueNumber from './blueNumber';


// Here, ActorStore is used to compute a derived state; A stateless Store wouldn't do the job.
module.exports = ActorStore(function greenNumber(on) {
  var currentOffset = 0;

  on(init);
  on(decrement, offset => currentOffset -= (10 * offset));
  on(increment, offset => currentOffset += (10 * offset));

  return {
    value: function() { return blueNumber.state + currentOffset }
  };
});