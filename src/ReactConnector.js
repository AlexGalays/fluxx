import React from 'react';
import { onChange } from './fluxx';

/* Wraps and render a Component when at least one Store changes */

export default React.createClass({

  componentWillMount: function() {
    let stores = this.props.stores;
    this.unsub = onChange.apply(null, stores)(_ => this.setState({}));
  },

  componentWillUnmount: function() {
    this.unsub();
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.stores.some((store, index) =>
      store.state !== this._states[index]
    );
  },

  render: function() {
    let children = this.props.children;
    this._states = this.props.stores.map(store => store.state);

    return typeof children == 'function'
      ? children.apply(null, this._states)
      : children;
  }

});