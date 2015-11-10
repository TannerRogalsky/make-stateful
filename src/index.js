/* @flow */
import WeakMap from 'core-js/library/es6/weak-map';
import Reflect from 'core-js/library/es6/reflect';

const FUNCTION_TYPE = 'function';
const isFunction = function(func : ?Function) : ?boolean {
  return typeof func === FUNCTION_TYPE;
};

const DEFAULT_STATE_NAME = 'DEFAULT_NO_STATE';

const extend = function(klass : Object) {
  const currentStateNames = new WeakMap();
  const originalPrototype = {};
  const possibleStates = {};

  for (const k in klass.prototype) {
    if (klass.prototype.hasOwnProperty(k)) {
      const v = klass.prototype[k];
      originalPrototype[k] = v;
    }
  }

  klass.prototype.gotoState = function(stateName : string = DEFAULT_STATE_NAME, ...args) {
    const currentStateName = currentStateNames.get(this);
    const currentState = possibleStates[currentStateName];
    const state = possibleStates[stateName];

    if (process.env.NODE_ENV !== 'production' && stateName !== DEFAULT_STATE_NAME && !state) {
      throw new Error('That state is not defined for this object.');
    }

    if (isFunction(this.exitState)) {
      this.exitState();
    }

    if (currentState !== null) {
      for (const k in currentState) {
        if (currentState.hasOwnProperty(k)) {
          Reflect.deleteProperty(this, k);
        }
      }
    }

    if (state) {
      Object.assign(this, state);
    } else {
      Object.assign(this, originalPrototype);
    }

    currentStateNames.set(this, stateName);
    if (isFunction(this.enterState)) {
      this.enterState(...args);
    }
  };

  klass.addState = function(stateName : string, state : Object) {
    possibleStates[stateName] = state;
  };
};

export default extend;
