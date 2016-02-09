
interface ActionDispatcher0 {
	(): void;
	_id: number;
}

interface ActionDispatcher1<P> {
	(value: P): void;
	_id: number;
}

interface DispatchedAction {
	is(fromDispatcher: ActionDispatcher0): this is DispatchedAction0;
	is<P>(fromDispatcher: ActionDispatcher1<P>): this is DispatchedAction1<P>;
}

interface DispatchedAction0 extends DispatchedAction {
	_id: number;
}

interface DispatchedAction1<P> extends DispatchedAction {
	_id: number;
	value: P;
}

interface StoreFactory {
	log: boolean;
	<S>(initialState: S, update: (state: S, action: Action<any>) => S): Store<S>;
}


export declare type Action<P> = DispatchedAction0 | DispatchedAction1<P>;

export interface Store<S> {
  state: S;
  subscribe(callback: (state: S) => void): () => void;
}

export var Store: StoreFactory;

export function Action(name: string): ActionDispatcher0;
export function Action<P>(name: string): ActionDispatcher1<P>;
