import React from 'react';
import { onChange } from './fluxx';

/* Wraps and render a Component when at least one Store changes */

export default React.createClass({

  componentWillMount() {
    const storeList = this.props.stores;

    this.stores = storeList.map(store => isFunction(store) ? store(this.props) : store);

    const unsub = onChange.apply(null, this.stores)(_ => this.setState({}));

    this.onUnmount = function() {
      unsub();
      // Also destroy (transient) stores that were created from factories
      storeList.filter(isFunction).forEach((_, i) => this.stores[i].unregister());
    };
  },

  componentWillUnmount() {
    this.onUnmount();
  },

  render() {
    let children = this.props.children;
    let states = this.stores.map(store => store.state);

    return children.apply(null, states);
  }

});

function isFunction(store) {
  return typeof store === 'function';
}