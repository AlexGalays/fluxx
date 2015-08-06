import dispatcher from './dispatcher';

/**
* Calls a function if any of the passed
* stores changed during one dispatcher run.
*/
export default function(...stores) {
  // curried, to separate the stores from the callback.
  return function(callback) {
    var count = 0;

    function inc() { count += 1 }
    function started() { count = 0 }
    function stopped() { if (count) callback() }

    dispatcher.on('started', started);
    dispatcher.on('stopped', stopped);
    stores.forEach(store => store._emitter.on('changed', inc));

    return function unsub() {
      dispatcher.removeListener('started', started);
      dispatcher.removeListener('stopped', stopped);
      stores.forEach(store => store._emitter.removeListener('changed', inc));
    }
  };
};