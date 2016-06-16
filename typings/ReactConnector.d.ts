
import React = __React;
import { Store as StoreInstance } from './fluxx';


type Store<P, S> = StoreInstance<S> | ((props: P) => StoreInstance<S>);


declare function connect<P, S>(
  component: React.ComponentClass<P>,
  store: Store<P, S>,
  stateSlicer: (state: S) => Object
): React.ComponentClass<P>;

declare function connect<P, S1, S2>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2> ],
  stateSlicer: (state1: S1, state2: S2) => Object
): React.ComponentClass<P>;

declare function connect<P, S1, S2, S3>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2>, Store<P, S3> ],
  stateSlicer: (state1: S1, state2: S2, state3: S3) => Object
): React.ComponentClass<P>;


export default connect;
