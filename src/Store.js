
let _globalStore;
export function globalStore() {
  return _globalStore;
}

let localStoreId = 1;
export let localStores = {};

export function GlobalStore(optionsOrInitialState, registerHandlers) {
  _globalStore = Store(optionsOrInitialState, registerHandlers, true);
  return _globalStore;
}

export function LocalStore(optionsOrInitialState, registerHandlers) {
  return Store(optionsOrInitialState, registerHandlers);
}

export default function Store(optionsOrInitialState, registerHandlers, isGlobal) {
  const { handlers } = registerHandlers ? {} : optionsOrInitialState;
  const initialState = registerHandlers ? optionsOrInitialState : optionsOrInitialState.state;
  const onHandlers = {};

  let dispatching = false;
  let callbacks = [];

  const instance = { state: initialState, log: Store.log };

  if (!isGlobal) {
    instance.id = localStoreId++;
    localStores[instance.id] = instance;
  }

  // on(action, callback) registration style
  if (registerHandlers) {
    const on = (action, fn) => { onHandlers[action] = fn }
    registerHandlers(on);
  }

  instance._handleAction = function(action, payloads) {
    if (dispatching) throw new Error(
      'Cannot dispatch an Action in the middle of another Action\'s dispatch');

    // Bail fast if this store isn't interested.
    const handler = handlers ? handlers[action._id] : onHandlers[action._id];
    if (!handler) return;

    dispatching = true;


    if (instance.log) {
      const payload = payloads.length > 1 ? payloads : payloads[0];
      console.log('%c' + action._name, 'color: #F51DE3', 'dispatched with payload ', payload);
    }

    const previousState = instance.state;

    try {
      instance.state = handlers
        ? handler.apply(null, [instance.state].concat(payloads))
        : handler(instance.state, payloads[0]);
    }
    finally {
      if (instance.log) {
        const storeKind = isGlobal ? 'global' : 'local';
        console.log(`%cNew ${storeKind} state:`, 'color: blue', instance.state);
      }

      dispatching = false;
    }

    if (previousState !== instance.state)
      callbacks.forEach(callback => callback(instance.state));
  };

  instance.subscribe = function(callback) {
    callbacks.push(callback);
    
    if (instance.log)
      console.log('%cInitial state:', 'color: green', initialState);

    return function unsubscribe() {
      callbacks = callbacks.filter(_callback => _callback !== callback);
      if (!isGlobal && callbacks.length === 0) {
        delete localStores[instance.id];
        if (instance.onDispose) instance.onDispose();
      }
    };
  };

  return instance;
}
