
import React = __React;
import { Store } from './fluxx';


export default function connect<P, S>(
  component: React.ComponentClass<P>,
  store: Store<S> | ((props: P) => Store<S>),
  stateSlicer: (state: S) => Object
): React.ComponentClass<P>;
