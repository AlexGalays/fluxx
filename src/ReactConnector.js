import React from 'react';
import { onChange } from './fluxx';

/* Wraps and render a Component when at least one Store changes */

export default React.createClass({

  componentWillMount: function() {
    this.stores = this.props.stores.map(store =>
      (typeof store == 'function') ? store(this.props) : store);

    this.unsub = onChange.apply(null, this.stores)(_ => this.setState({}));
  },

  componentWillUnmount: function() {
    this.unsub();
  },

  render: function() {
    let children = this.props.children;
    let states = this.stores.map(store => store.state);

    return children.apply(null, states);
  }

});