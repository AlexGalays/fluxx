
# Fluxx

A straight to the point and efficient implementation of the [Facebook flux guidelines](http://facebook.github.io/flux/docs/overview.html).

The key elements are kept
- A central dispatcher enforcing the sequential/unidirectional flow
- Stores can depend on other stores

but there is far less boilerplate.

Fluxx also support a [state-machine notation for action handlers](#stateMachine).


## Simple example


### store.js (Store and Actions)
```javascript
var { Store, Action } = require('fluxx');

var action = Action.create('init', 'increment', 'decrement');

var store = Store(function valueStore(on) {

  // The store's internal state
  var value = 0;

  // When the store receives the init Action,
  // initialize its initial state with the action's payload.
  on(action.init, val => {
    value = val;
  });

  on(action.decrement, offset => {
    value -= offset;
  });

  on(action.increment, offset => {
    value += offset;
  });

  // The store public API; Here we decided to only use functions (Uniform access principle)
  return {
    value: () => value
  };
});

module.exports = { store, action };
```

### view.js Redrawing the view on store change
```javascript

var { onChange } = require('fluxx').Store;
var { store, action } = require('./valueStore');

// Render again whenever the store changes
onChange(store)(render);

function render() {
  console.log('render!');
  // Actually render a component using React, virtual-dom, etc 
}

// Trigger the increment action: Increment store's value by 33
action.increment(33);

``` 


## Example showing dependOn and preventing change dispatch

```javascript
var { store, action } = require('./valueStore');

var derivedValueStore = Store(function myDerivedStoreName(on, dependOn) {

  /*
   * This derived store depends on valueStore, meaning we let valueStore update its state before we do, for every action we listen to.
   * However, this store will dispatch change events only for the actions it explicitely listens to.
   */
  dependOn(store);

  var value;

  on(action.init, function() {
    value = derivedValue();
  });

  // Not interested in the decrement action

  on(action.increment, function() {
    var newValue = derivedValue();

    // Only increment our value if the primary store's value is under 100.
    if (newValue < 100) value = newValue;
    // As an optimization, we can return false to tell the dispatcher this store's state didn't actually change.
    else return false;
  });

  function derivedValue() {
    return store.value() * 2;
  }

  // The store public API
  return {
    value: () => value
  };

});

```


## Differences with the Facebook examples

- The dispatcher is now an implementation detail. It is no longer needed to explicitly import it in your code. (The actions and stores use it behind the scene)

- Provide a constructor for Stores. The examples encourage `switch/case/break` which is pretty poor style and error prone in JS or in most language; Instead, a list of action -> callback is used.

- Provide a constructor for Actions.

- Simplified API: Removed boilerplate, got rid of dispatch tokens: Instead use store instances directly.

```javascript
dispatcher.waitFor([store1.dispatchToken, store2.dispatchToken])
// Becomes
dependOn(store1, store2)
```

- Use closure-style modules instead of clumsy pseudo/es6 classes

- Performance: `Store.onChange(store1, store2)` can be used to render a view only once when either store1 or store2 was updated during one dispatcher run. The Facebook examples call `render()` twice if two stores were updated, which is wasteful.

## Enabling logging

This will log all action dispatching along with the list of stores that handled the action.  
Note: For easier debugging, give proper names to your stores, e.g `var store = Store(function someName() {})`

```javascript
var fluxx = require('fluxx');

fluxx.enableLogs();
```

## Full example

[Here](example/src)

<a name="stateMachine"></a>
## State machine

```javascript
var { Store, Action } = require('fluxx');

var { push, coin } = Action.create('push', 'coin');

Store(function turnstile(on, _, when) {

  var locked = true;

  // Handler without a condition
  on(push, _ => console.log('push'));

  // Handlers valid only when the turnstile is locked
  when(_ => locked, function() {
    on(coin, _ => { locked = false });
  });

  // Handlers valid only when the turnstile is unlocked
  when(_ => !locked, function() {
    on(push, _ => { locked = true });
  });

});

coin();
push();

```


# Running the tests
```
mocha --ui tdd
```
