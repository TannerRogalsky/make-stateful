/* @flow */
const FUNCTION_TYPE = 'function';
const isFunction = function(func : ?Function) : ?boolean {
  return typeof func === FUNCTION_TYPE;
};

const extend = function(klass) {
  var states = {undefined: klass.prototype};

  klass.addState = function(stateName, state) {
    states[stateName] = state;
  }

  return new Proxy(klass, {
    construct: function(target, args) {
      var currentState = target.prototype;
      var instance = Reflect.construct(target, args);

      instance.gotoState = function(stateName, ...args) {
        if (process.env.NODE_ENV !== 'production' && states[stateName] == null) {
          throw new Error('That state is not defined for this object.');
        }

        if (isFunction(this.exitState)) {
          this.exitState();
        }

        currentState = states[stateName];

        if (isFunction(this.enterState)) {
          this.enterState(...args);
        }
      }

      return new Proxy(instance, {
        get: function(target, name, receiver) {
          if (currentState[name]) {
            return currentState[name];
          } else {
            return target[name];
          }
        }
      });
    }
  });
}

export default extend;
