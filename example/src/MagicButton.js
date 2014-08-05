/** @jsx React.DOM */

var React   = require('react');
var actions = require('./actions');


var MagicButton = React.createClass({

  getDefaultProps: function() {
    return {offset: 4};
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
    actions.increment(this.props.offset);
  },

  decrement: function() {
    actions.decrement(this.props.offset);
  }

});


module.exports = MagicButton;