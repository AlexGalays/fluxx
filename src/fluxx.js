import dispatcher from './dispatcher';
import Action from './Action';
import Store from './Store';
import ActorStore from './ActorStore';
import onChange from './onChange';
import NO_CHANGE from './noChange';

export default {
  Action,
  Store,
  ActorStore,
  onChange,
  NO_CHANGE,

  enableLogs: () => dispatcher.log = true
};