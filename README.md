
# Fluxx

A simple and efficient implementation of the [Facebook flux guidelines](http://facebook.github.io/react/docs/flux-overview.html).

The key elements are kept
- A central dispatcher enforcing the flow
- Stores can depend on other stores

## Differences with the Facebook examples

- The dispatcher is now an implementation detail. It is no longer needed to explicitly import it in your code. (The actions and stores use it behind the scene)

- Provide a constructor for Stores. The examples encourage `switch/case/break` which is pretty poor style and error prone in JS or in most language; Instead, a list of action -> callback is used.

- Provide a constructor for Actions.

- Simplified API: Got rid of dispatch tokens; Instead use store instances directly.

```javascript
dispatcher.waitFor([store1.dispatchToken, token2.dispatchToken])
// Becomes
waitFor(store1, store2)
```

- Use closure-style modules instead of clumsy pseudo/es6 classes

- Performance: `Store.when(signal1, signal2)` can be used to render a view only once when either signal1 or signal2 was sent during one dispatcher run. The Facebook examples call `render()` twice if two stores were updated, which is very wasteful.


## Example

[Here](example/src)