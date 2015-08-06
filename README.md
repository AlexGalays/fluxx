
![fluxx-logo](http://i171.photobucket.com/albums/u320/boubiyeah/photon_small_zps6sgduwbx.png)

A straight to the point and efficient implementation of the [Facebook flux guidelines](http://facebook.github.io/flux/docs/overview.html).

The key elements are kept
- A central dispatcher enforcing the sequential/unidirectional flow
- Stores can depend on other stores

but there is far less boilerplate.  

# Content
* [Stores](#stores)
  * [Store](#store)
  * [ActorStore](#actorStore)
    * [Defining a store and its actions](#storeAndActions)
    * [Depending on another store](#dependOn)
    * [Preventing the changed event from being dispatched](#preventChangeEvent)
    * [State machine](#stateMachine)
* [Manually redrawing the view on store change](#manualRedraw)
* [React Connector](#reactConnector)
* [Differences with the Facebook implementation](#facebookImplementation)
* [Full example](#fullExample)


<a name="stores"></a>
## Stores

There are two possible styles to create Stores in fluxx.  

**Store**  
As a rule of thumb, if you're using ES6 and a view layer with a rich component model (e.g `React`), try to pick the simple `Store` as a default. It's more functional and only manages one state datum. Any data transformation must occur outside the store as the store itself has no API.  

**ActorStore**  
On the other hand, `ActorStore` might be more suited when using near-stateless view layers (e.g `virtual-dom`) 
where a richer OO Store can help compensate the statelessness of the view.


<a name="store"></a>
### Store

```javascript
import { Store, Action } from 'fluxx';
import otherStore from './otherStore';

var action = Action.create('increment', 'decrement');

var store = Store({
  // The initial state
  state: 0, 

  // Action handlers transforming the state
  handlers: {
    [action.increment]: (state, by) => state + by,
    [action.decrement]: (state, by) => state - by
  },

  // Store dependencies
  dependOn: otherStore
});

action.increment(30);
action.decrement(5);

console.log(store.state == 25);

``` 

<a name="actorStore"></a>
### ActorStore


```javascript
import { ActorStore, Action } from 'fluxx';
import otherStore from'./otherStore';

var action = Action.create('increment', 'decrement');

var store = ActorStore(function(on, dependOn) {
  dependOn(otherStore);

  // The store's private state; The store could have many of these.
  var value = 0;

  // When the store receives the init Action,
  // initialize its initial state with the action's payload.
  on(action.init, val => value = val);

  on(action.decrement, offset => value -= offset);
  on(action.increment, offset => value += offset);

  // The store public API; Here we decided to only use functions (Uniform access principle)
  // For convenience, the API can be rich and return various utility functions (`findById`, etc)
  return {
    value: () => value
  };
});

action.increment(30);
action.decrement(5);

console.log(store.value() == 25);
```

In any case, if you need to update a Store's state (usually a JSON-like tree) in an immutable way, have a look at: [immupdate](https://github.com/AlexGalays/immupdate)  


<a name="storeAndActions"></a>
### Defining a Store and its Actions
```javascript
import { ActorStore, Action } from 'fluxx';

var action = Action.create('init', 'increment', 'decrement');

var store = ActorStore(function(on) {

  var value = 0;

  // When the store receives the init Action,
  // initialize its initial state with the action's payload.
  on(action.init, val => value = val);

  on(action.decrement, offset => value -= offset);
  on(action.increment, offset => value += offset);

  // The store public API; Here we decided to only use functions (Uniform access principle)
  return {
    value: () => value
  };
});

export { store, action };
```

<a name="dependOn"></a>
### Depending on another store

```javascript
import { ActorStore } from 'fluxx';
import { store, action } from './valueStore';

var derivedValueStore = ActorStore(function(on, dependOn) {

  /*
   * This derived store depends on valueStore, meaning we let valueStore update its state before we do, for every action we listen to.
   * However, this store will only dispatch change events for the actions it explicitly listens to.
   */
  dependOn(store);

  // Not interested in the decrement action

  on(action.increment);

  // The store public API; this could return many util functions.
  return {
    value: () => store.value() * 2
  };

});

```

<a name="preventChangeEvent"></a>
### Preventing the `changed` event from being dispatched

As an optimization, an action handler can return `NO_CHANGE` to tell the dispatcher this store's state didn't actually change.

```javascript
import { ActorStore, NO_CHANGE } from 'fluxx';

ActorStore(function(on) {

  var value = 0;

  on(action.increment, () => {
    if (value < 100) value++;
    else return NO_CHANGE;
  });

  // The store public API; this could return many util functions.
  return {
    value: () => value
  };

});

```

<a name="stateMachine"></a>
### State machine

```javascript
import { ActorStore, Action } from 'fluxx';

var { push, coin } = Action.create('push', 'coin');

ActorStore(function turnstile(on, _, when) {

  var locked = true;

  // Handler without a condition
  on(push, _ => console.log('push'));

  // Handlers valid only when the turnstile is locked
  when(_ => locked, () => {
    on(coin, _ => locked = false);
  });

  // Handlers valid only when the turnstile is unlocked
  when(_ => !locked, () => {
    on(push, _ => locked = true);
  });

});

coin();
push();

```

<a name="manualRedraw"></a>
## Manually redrawing the view on store change
```javascript

import { onChange } from 'fluxx';
import { store, action } from './valueStore';

// Render again whenever the store changes; `onChange` can take any number of stores as arguments.
onChange(store)(render);

function render() {
  console.log('render!');
  // Actually render a component using React, virtual-dom, etc 
}

// Trigger the increment action: Increment store's value by 33
action.increment(33);

``` 

<a name="reactConnector"></a>
## React connector

When using `React` and `Store`, you can wrap a component in a Connector for it to be automatically redrawn when 
an Array of stores changes.  
Note: `ReactConnector` only understand `Store` instances; It's also quite opinionated and won't redraw its children if all the Store's states are still stricly equal to their previous values (to discourage in-place mutations).   
At this time, it is not possible to dynamically change the Store array.

```javascript
import Fluxx from 'fluxx/addon/ReactConnector';
import store1 from './store1';
import store2 from './store2';
import MyComp from './myComponent';

var instance = (
  <Fluxx stores={[store1, store2]}>{ (one, two) =>
    <MyComp 
      propOne={one}
      propTwo={two} 
    />
  }
  </Fluxx>
);

// Or

var instance = (
  <Fluxx stores={[store1, store2]}>
    <MyComp/>
  </Fluxx>
);

```


<a name="facebookImplementation"></a>
## Differences with the Facebook implementation

- The dispatcher is now an implementation detail. It is no longer needed to explicitly import it in your code. (The actions and stores use it behind the scene)

- Provide a constructor for Stores. The examples encourage `switch/case/break` which is pretty poor style and error prone in JS or in most language; Instead, a list of action -> callback is used.

- Provide a constructor for Actions. Actions instances can be used directly in stores: No need for tedious constants.

- Simplified API: Removed boilerplate, got rid of dispatch tokens: Instead use store instances directly.

```javascript
dispatcher.waitFor([store1.dispatchToken, store2.dispatchToken])

// Becomes

dependOn: [store1, store2] // Store
// or
dependOn(store1, store2) // ActorStore
```

- Use closure-style modules instead of clumsy pseudo/es6 classes

- Performance: `Store.onChange(store1, store2)` can be used to render a view only once when either store1 or store2 was updated during one dispatcher run. The Facebook examples call `render()` twice if two stores were updated, which is wasteful.

## Enabling logging

This will log all action dispatching along with the list of stores that handled the action.  
Note: For easier debugging, give proper names to your stores, e.g:  


```javascript
var store = Store({ name: 'myStore' });
```

Or

```javascript
var store = ActorStore(function someName() {})
```

```javascript
var fluxx = require('fluxx');

fluxx.enableLogs();
```

<a name="fullExample"></a>
## Full example

[Here](example/src)


## Running the tests
```
npm run test
```
