import * as React from 'react';
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

declare function connect<P, S1, S2, S3, S4>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2>, Store<P, S3>, Store<P, S4> ],
  stateSlicer: (state1: S1, state2: S2, state3: S3, state4: S4) => Object
): React.ComponentClass<P>;

declare function connect<P, S1, S2, S3, S4, S5>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2>, Store<P, S3>, Store<P, S4>, Store<P, S5> ],
  stateSlicer: (state1: S1, state2: S2, state3: S3, state4: S4, state5: S5) => Object
): React.ComponentClass<P>;

declare function connect<P, S1, S2, S3, S4, S5, S6>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2>, Store<P, S3>, Store<P, S4>, Store<P, S5>, Store<P, S6> ],
  stateSlicer: (state1: S1, state2: S2, state3: S3, state4: S4, state5: S5, state6: S6) => Object
): React.ComponentClass<P>;

declare function connect<P, S1, S2, S3, S4, S5, S6, S7>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2>, Store<P, S3>, Store<P, S4>, Store<P, S5>, Store<P, S6>, Store<P, S7> ],
  stateSlicer: (state1: S1, state2: S2, state3: S3, state4: S4, state5: S5, state6: S6, state7: S7) => Object
): React.ComponentClass<P>;

declare function connect<P, S1, S2, S3, S4, S5, S6, S7, S8>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2>, Store<P, S3>, Store<P, S4>, Store<P, S5>, Store<P, S6>, Store<P, S7>, Store<P, S8> ],
  stateSlicer: (state1: S1, state2: S2, state3: S3, state4: S4, state5: S5, state6: S6, state7: S7, state8: S8) => Object
): React.ComponentClass<P>;

declare function connect<P, S1, S2, S3, S4, S5, S6, S7, S8, S9>(
  component: React.ComponentClass<P>,
  stores: [ Store<P, S1>, Store<P, S2>, Store<P, S3>, Store<P, S4>, Store<P, S5>, Store<P, S6>, Store<P, S7>, Store<P, S8>, Store<P, S9> ],
  stateSlicer: (state1: S1, state2: S2, state3: S3, state4: S4, state5: S5, state6: S6, state7: S7, state8: S8, state9: S9) => Object
): React.ComponentClass<P>;

export default connect;
