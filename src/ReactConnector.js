import React, { createElement } from 'react';
import shallowEqual from './shallowEqual';


/* Wraps a React Component and re-render it when the Store changes */

export default function connect(Component, stores, stateSlicer) {

  return class Connect extends React.Component {

    constructor(props, context) {
      super(props, context);
      this.state = {};
      this.onStoreChange = this.onStoreChange.bind(this);
    }

    componentWillMount() {
      this.mounted = true;
      this.propsChanged = true;

      if (!Array.isArray(stores)) stores = [stores];
      this.stores = stores.map(store => isFunction(store) ? store(this.props) : store);

      this.unsubscribe = this.subscribeToStores(this.stores);

      // Initial render
      this.updateFromStores();
    }

    componentWillUnmount() {
      this.mounted = false;
      this.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(this.props, nextProps))
        this.propsChanged = true;
    }

    subscribeToStores(stores) {
      const unsubFns = stores.map(store => store.subscribe(this.onStoreChange));

      return function() {
        unsubFns.forEach(fn => fn());
      }
    }

    onStoreChange() {
      if (this.nextRedraw) return

      this.nextRedraw = requestAnimationFrame(() => {
        this.nextRedraw = undefined

        if (this.mounted)
          this.updateFromStores()
      })
    }

    updateFromStores() {
      const states = this.stores.map(store => store.state);
      const currentSlice = this.state.stateSlice;
      const newSlice = stateSlicer.apply(null, states);

      if (!currentSlice || !shallowEqual(currentSlice, newSlice)) {
        this.stateChanged = true;
        this.setState({ stateSlice: newSlice });
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
