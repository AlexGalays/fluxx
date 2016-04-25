import React, { createElement } from 'react';
import shallowEqual from './shallowEqual';


/* Wraps a React Component and re-render it when the Store changes */

export default function connect(Component, store, stateSlicer) {

  return class Connect extends React.Component {

    constructor(props, context) {
      super(props, context);
      this.state = {};
    }

    componentWillMount() {
      this.propsChanged = true;

      this.store = isFunction(store) ? store(this.props) : store;

      this.unsubscribe = this.store.subscribe(this.onStoreChange.bind(this));
      this.onStoreChange(this.store.state);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(this.props, nextProps))
        this.propsChanged = true;
    }

    onStoreChange(state) {
      const currentState = this.state.stateSlice;
      const newState = stateSlicer(state);

      if (!currentState || !shallowEqual(currentState, newState)) {
        this.stateChanged = true;
        this.setState({ stateSlice: newState });
      }
    }

    render() {
      // Combine props and state inside render() to have a cohesive view of the system:
      // Both the store and the props given by our parents may have changed.
      // The below check is equivalent to a delayed shouldComponentUpdate.
      if (this.propsChanged || this.stateChanged) {
        this.propsChanged = this.stateChanged = false;
        const childProps = { ...this.props, ...this.state.stateSlice };
        this.childElement = createElement(Component, childProps);
      }

      return this.childElement;
    }
  };
};

function isFunction(x) {
  return Object.prototype.toString.call(x) === '[object Function]';
}
