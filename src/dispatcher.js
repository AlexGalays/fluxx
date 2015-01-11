'use strict';

var Signal    = require('signals').Signal;
var invariant = require('./invariant');


/**
* Singleton dispatcher used to broadcast payloads to stores.
* Ensures the application state stored in the stores is updated predictably.
*/
var dispatcher = (function() {

  var dispatching = false;
  var storeId = 0;

  var stores = {};
  var isPending = {};
  var isHandled = {};

  var currentAction = null;
  var currentPayload = null;

  var started = new Signal();
  var stopped = new Signal();


  function register(store) {
    stores[storeId] = store;
    store._id = storeId;
    storeId++;
  }

  function unregister(store) {
    invariant(stores[store._id],
      'Dispatcher.unregister(...): `%s` does not map to a registered store.',
      store
    );

    delete stores[store._id];
  }

  function waitFor() {
    var storeDeps = arguments;

    invariant(dispatching,
      'dispatcher.waitFor(...): Must be invoked while dispatching.'
    );

    for (var i = 0; i < storeDeps.length; i++) {
      var store = storeDeps[i];
      var id = store._id;

      if (isPending[id]) {
        invariant(isHandled[id],
          'dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }

      invariant(stores[id],
        'dispatcher.waitFor(...): `%s` does not map to a registered store.',
        id
      );

      notifyStore(id);
    }
  }

  function dispatch(actionName, payload) {
    invariant(!dispatching,
      'dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );

    currentAction = actionName;
    currentPayload = payload;

    startDispatching();

    try {
      for (var id in stores) {
        if (isPending[id]) continue;
        notifyStore(id);
      }
    }
    finally {
      stopDispatching();
    }
  }

  function startDispatching() {
    dispatching = true;

    for (var id in stores) {
      isPending[id] = false;
      isHandled[id] = false;
    }

    started.dispatch();
  }

  function stopDispatching() {
    currentAction = currentPayload = null;
    dispatching = false;

    stopped.dispatch();
  }

  function notifyStore(id) {
    isPending[id] = true;
    stores[id]._handleAction(currentAction, currentPayload);
    isHandled[id] = true;
  }

  return {
    register: register,
    unregister: unregister,
    waitFor: waitFor,
    dispatch: dispatch,
    started: started,
    stopped: stopped
  };

})();


module.exports = dispatcher;