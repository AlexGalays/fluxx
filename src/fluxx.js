
import _Action from './Action';
import _Store, {
  GlobalStore as _GlobalStore,
  globalStore as _globalStore,
  LocalStore as _LocalStore
} from './Store';

export const Store = _Store;
export const GlobalStore = _GlobalStore;
export const globalStore = _globalStore;
export const LocalStore = _LocalStore;
export const Action = _Action;
