
# Fluxx

A straight to the point and efficient implementation of the [Facebook flux guidelines](http://facebook.github.io/react/docs/flux-overview.html).

The key elements are kept
- A central dispatcher enforcing the sequential/unidirectional flow
- Stores can depend on other stores


```javascript
var Store = require('fluxx').Store;
var Action = require('fluxx').Action;
var onChange = Store.onChange;

var valueStore = Store(function(on) {

  // The store's actual state
  var value = 0;

  // When the store receives the init Action,
  // initialize its initial state with the action's payload.
  on(init, function(val) {
    value = val;
  });

  on(decrement, function(offset) {
    value -= offset;
  });

  on(increment, function(offset) {
    value += offset;
  });

  // The store public API
  return {
    value: function() { return value }
  };
});

/* Somewhere else in the code */

// Create an action object with an unique name
var increment = Action('increment');

// increment store's value by 33
increment(33);


/* Somewhere else in the code */

// Render again whenever the store changed
onChange(valueStore, anotherStore)(render);

```


## Differences with the Facebook examples

- The dispatcher is now an implementation detail. It is no longer needed to explicitly import it in your code. (The actions and stores use it behind the scene)

- Provide a constructor for Stores. The examples encourage `switch/case/break` which is pretty poor style and error prone in JS or in most language; Instead, a list of action -> callback is used.

- Provide a constructor for Actions.

- Simplified API: Removed boilerplate, got rid of dispatch tokens: Instead use store instances directly.

```javascript
dispatcher.waitFor([store1.dispatchToken, token2.dispatchToken])
// Becomes
waitFor(store1, store2)
```

- Use closure-style modules instead of clumsy pseudo/es6 classes

- Performance: `Store.onChange(store1, store2)` can be used to render a view only once when either store1 or store2 was updated during one dispatcher run. The Facebook examples call `render()` twice if two stores were updated, which is very wasteful.

## Full example

[Here](example/src)