'use strict';

var EventEmitter = require('events');

/**
* Singleton dispatcher used to broadcast action payloads to stores. You do not use this module directly.
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

  var dispatcher = Object.create(new EventEmitter);


  function register(store) {
    stores[storeId] = store;
    store._id = storeId;
    storeId++;
  }

  function unregister(store) {
    if (!stores[store._id]) throw new Error(
      'Dispatcher.unregister(...): `' + store._name + '` is not to a registered store.');

    delete stores[store._id];
  }

  function waitFor() {
    var storeDeps = arguments;

    if (!dispatching) throw new Error(
      'dispatcher.waitFor(...): Must be invoked while dispatching.');

    for (var i = 0; i < storeDeps.length; i++) {
      var store = storeDeps[i];
      var id = store._id;

      if (isPending[id]) {
        if (!isHandled[id]) throw new Error(
          'dispatcher.waitFor(...): Circular dependency detected while waiting for ' + id);

        continue;
      }

      if (!stores[id]) throw new Error(
        'dispatcher.waitFor(...): ' + id + ' does not map to a registered store.');

      notifyStore(id);
    }
  }

  function dispatch(action, payloads) {
    if (dispatching) throw new Error(
      'dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.');

    if (dispatcher.log) {
      console.log('%c' + action, 'color: #F51DE3', 'dispatched with payloads ', JSON.stringify(payloads));
      console.log('  handled by stores: ');
    }

    currentAction = action;
    currentPayload = payloads;

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

    dispatcher.emit('started');
  }

  function stopDispatching() {
    currentAction = currentPayload = null;
    dispatching = false;

    dispatcher.emit('stopped');
  }

  function notifyStore(id) {
    isPending[id] = true;

    var store = stores[id];
    var result = store._handleAction(currentAction, currentPayload);

    if (dispatcher.log && result !== undefined) {
      var updateMsg = (result === false) ? '(did not update its UI state)' : '';
      console.log('    %c' + store._name, 'color: blue', updateMsg);
    }

    isHandled[id] = true;
  }

  dispatcher.register = register;
  dispatcher.unregister = unregister;
  dispatcher.waitFor = waitFor;
  dispatcher.dispatch = dispatch;

  return dispatcher;
})();


module.exports = dispatcher;