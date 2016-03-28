
interface OnAction<S> {
  (action: NoArgAction, updater: (state: S) => S): void;
  <P>(action: Action<P>, updater: (state: S, payload: P) => S): void;
}

interface StoreStatics {
  log: boolean;
}

export interface Store<S> {
  log: boolean;
  state: S;
  subscribe(callback: (state: S) => void): () => void;
}

// Marker interface
interface LocalStore<S> extends Store<S> {
  _isLocalStore: any;
}

// Marker interface
interface GlobalStore<S> extends Store<S> {
  _isGlobalStore: any;
}

interface LocalStoreFactory {
	<S>(initialState: S, registerActions: (on: OnAction<S>) => void): LocalStore<S>;
}

interface GlobalStoreFactory {
  <S>(initialState: S, registerActions: (on: OnAction<S>) => void): GlobalStore<S>;
}

export var Store: StoreStatics;
export var GlobalStore: GlobalStoreFactory;
export var LocalStore: LocalStoreFactory;

export type NoArgAction = () => void;
export type Action<P> = (payload: P) => void;

export function Action(name: string): NoArgAction;
export function Action<P>(name: string): Action<P>;
