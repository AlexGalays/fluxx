'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fluxx = require('./fluxx');

/* Wraps and render a Component when at least one Store changes */

exports['default'] = _react2['default'].createClass({
  displayName: 'ReactConnector',

  componentWillMount: function componentWillMount() {
    var _this = this;

    var stores = this.props.stores;
    this.unsub = _fluxx.onChange.apply(null, stores)(function (_) {
      return _this.setState({});
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    this.unsub();
  },

  render: function render() {
    var children = this.props.children;
    this._states = this.props.stores.map(function (store) {
      return store.state;
    });

    return typeof children == 'function' ? children.apply(null, this._states) : children;
  }

});
module.exports = exports['default'];