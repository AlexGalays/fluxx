
![fluxx-logo](http://i171.photobucket.com/albums/u320/boubiyeah/photon_small_zps6sgduwbx.png)

More akin to Redux than Facebook flux, `fluxx` lets you manage
your application state in a terse, centralized and scalable way.  
It also has first-class support for typescript.

# Content

* [Store](#store)
* [Manually redrawing the view on store change](#manualRedraw)
* [Async actions](#asyncActions)
* [React Connector](#reactConnector)
* [Full example](#fullExample)
* [Typescript store](#typescriptStore)


<a name="store"></a>
## Store

```javascript
import { GlobalStore, Action } from 'fluxx';
import otherStore from './otherStore';

// The action names (passed in the Action factory) can be anything,
// they're just here to help during debug (Store.log = true)
const increment = Action('increment');
const decrement = Action('decrement');

const store = GlobalStore({
  // The initial state
  state: 0,

  // Action handlers transforming the state
  handlers: {
    [action.increment]: (state, by) => state + by,
    [action.decrement]: (state, by) => state - by
  }
});

action.increment(30);
action.decrement(5);

console.log(store.state === 25);

```

<a name="preventChangeEvent"></a>
### Preventing the store from dispatching the change event

Simply return the same state reference in the update handler and the store won't dispatch this event.


<a name="manualRedraw"></a>
## Manually redrawing the view on store change
```javascript

import { store, action } from './valueStore';

// Render again whenever the store changes
const unsubscribe = store.subscribe(render);

function render() {
  console.log('render!');
  // Actually render a component using React, virtual-dom, etc
}

// Trigger the increment action: Increment store's value by 33
action.increment(33);

```
<a name="asyncActions"></a>
## Async actions

Fluxx don't have these as they are not necessary.  
As an example, here's a suggestion of how one could structure her code performing ajax calls:  

```javascript

/* saveTodo.js */

import { savingTodo, todoSaved, todoSaveFailed } from './actions';

export default function(todo) {
  // Tell the store we're about to attempt persisting a new todo on the server.
  // Could be used to optimistically add the todo on screen and/or show a progress indicator
  savingTodo(todo);

  fetch('/todos', { method: 'post', body: todo })
    // Tell the store the todo was successfully saved: Remove the progress indicator
    .then(res => todoSaved(todo))
    // Tell the store there was an error while saving the todo, mark the todo as local only, display errors, offer retry, etc.
    .catch(err => todoSaveFailed(todo));
}
```

<a name="reactConnector"></a>
## React connector

To use both `React` and `fluxx`, a connector add-on is provided to connect any component to the store.

The connected component will only re-render when the store's datum of interest actually changed.
This means you can not just mutate the store's state, its reference should change if it was actually updated.
This is consistent with the various React practices needed to get good performances.

If you wish to use basic Objects and Arrays as your store's state, you may want to check [immupdate](https://github.com/AlexGalays/immupdate).  

Which components should be connected to the store? The answer is 'some of them'.  

Too few connected components and you will have to write a lot of boilerplate to manually pass down props instead.
Furthermore, you will suffer mild performance penalties as parents will 'update' simply because they need to pass
some data to their children as props.  

Too many connected components and the data flow becomes a bit harder to follow.  

As a rule of thumb, connect at least the smart components managing a particular routing hierarchy, plus any heavily nested
smart component that needs some data its parents don't.  

```javascript
import connect from 'fluxx/lib/ReactConnector';

// Your store instance; also import an Action
import store, { incrementBy } from './store';


class Blue extends React.Component {
	render() {
		const { count } = this.props;

		return (
      <p onClick={ incrementBy10 }>{ count }</p>
		);
	}
};

function incrementBy10() { incrementBy(10) }

// Takes a component, the store instance and a function returning the slice of data we're interested in.
export default connect(Blue, store, state => (
	{ count: state.blue.count }
));

```


## Enabling logging

This will log all action dispatching along with the updated state of the store afterwards.

```javascript
import { Store } from 'fluxx';
Store.log = true;
```

<a name="fullExample"></a>
## Full example

Coming soon...

<a name="typescriptStore"></a>
### Typescript store

fluxx has first class support for typescript. This means EVERYTHING will be type-safe!  
However, to achieve that, a few changes are required compared to using fluxx with plain javascript:  

Action declaration

```javascript
import { Action } from 'fluxx';

// Declare an action that takes no argument
export const increment = Action('increment');

// Declare an action that takes an argument of type number.
// It could of course be any custom type as well.
export const incrementBy = Action<number>('incrementBy');
```

Store creation

```javascript

import { GlobalStore } from 'fluxx';
import update from 'immupdate';

interface State {
  count: number,
  somethingElse: string
}

const initialState = { count: 0, somethingElse: '' };

// Create the actual store instance
GlobalStore(initialState, on => {
  on(action.incrementBy, (state, by) => update(state, { count: c => c + by }));
});

```

Connecting a React component to the store

```javascript
import connect from 'fluxx/lib/ReactConnector';

// Your store instance; also import an Action
import store, { incrementBy } from './store';

// Declare the props our parent should give us
interface ParentProps {
	params: { id: string },
	children: React.ReactElement<any>
}

// Declare our "own" props,
// that is the store's slice of state that get injected to our props by connect.
interface StoreProps {
	count: number
}

// Our final props is the combination of the two prop sources.
// Of course, it is not strictly required to split props in two interfaces.
type Props = ParentProps & StoreProps;

class Blue extends React.Component<Props, void> {
	render() {

    // Type safe deconstruction
		const { count, params: { id } } = this.props;

    return (
      <p onClick={ incrementBy10 }>{ count }</p>
		);
	}
};

// Action dispatching is also type-safe: we could not pass anything other than a number here.
function incrementBy10() { incrementBy(10) }


export default connect(Blue, store, (state): StoreProps => (
	{ count: state.count }
));

```



## Running the tests
```
npm run test
```
