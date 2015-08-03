import React from 'react';
import { init, decrement, increment } from './actions';


export default React.createClass({

  getDefaultProps: function() {
    return { offset: 4 };
  },

  render: function() {
    return (
      <div>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    );
  },

  increment: function() {
    increment(this.props.offset);
  },

  decrement: function() {
    decrement(this.props.offset);
  }

});