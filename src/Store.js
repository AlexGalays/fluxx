
/**
* Creates the store singleton.
*/
export default function Store(optionsOrInitialState, update) {
  const { state, handlers } = update ? {} : optionsOrInitialState;
  const initialState = update ? optionsOrInitialState : state;

  let dispatching = false;
  let callbacks = [];

  _instance = { state: initialState };

  if (Store.log)
    console.log('%cInitial state:', 'color: green', state);

  _instance._handleAction = function(action, payloads) {
    if (dispatching) throw new Error(
      'Cannot dispatch an Action in the middle of another Action\'s dispatch');

    dispatching = true;

    if (Store.log) {
      const payload = handlers ? payloads : payloads[0];
      console.log('%c' + action._name, 'color: #F51DE3', 'dispatched with payload ', payload);
    }

    const previousState = _instance.state;

    try {
      // JS, dynamic style
      if (handlers) {
        const handler = handlers[action._id];
        _instance.state = handler.apply(null, [_instance.state].concat(payloads));
      }
      // Typescript style
      else {
        const dispatchedAction = {
          _id: action._id,
          value: payloads[0],
          is: actionIs
        };
        _instance.state = update(_instance.state, dispatchedAction);
      }
    }
    finally {
      if (Store.log)
        console.log('%cNew state:', 'color: blue', _instance.state);

      dispatching = false;
    }

    if (previousState !== _instance.state)
      callbacks.forEach(callback => callback(_instance.state));
  };

  _instance.subscribe = function(callback) {
    callbacks.push(callback);

    return function unsubscribe() {
      callbacks = callbacks.filter(_callback => _callback !== callback);
    };
  };

  return _instance;
}

// Type refinement for Typescript
function actionIs(fromDispatcher) {
  return this._id === fromDispatcher._id;
}


let _instance;
export function instance() {
  return _instance;
}
