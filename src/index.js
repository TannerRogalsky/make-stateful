const isFunction = function isFunction(func) {
  return typeof func === 'function';
};

export default function extend(klass) {
  const states = { undefined: klass.prototype };

  // eslint-disable-next-line no-param-reassign
  klass.addState = function addState(stateName, state) {
    states[stateName] = state;
  };

  return new Proxy(klass, {
    construct(constructTarget, constructArgs) {
      let currentState = constructTarget.prototype;
      const instance = Reflect.construct(constructTarget, constructArgs);

      instance.gotoState = function gotoState(stateName, ...gotoStateArgs) {
        if (process.env.NODE_ENV !== 'production' && states[stateName] == null) {
          throw new Error('That state is not defined for this object.');
        }

        if (isFunction(this.exitState)) {
          this.exitState();
        }

        currentState = states[stateName];

        if (isFunction(this.enterState)) {
          this.enterState(...gotoStateArgs);
        }
      };

      return new Proxy(instance, {
        get(getTarget, name) {
          const propertyDescriptor = Object.getOwnPropertyDescriptor(currentState, name);
          if (propertyDescriptor) {
            if (propertyDescriptor.get) {
              return propertyDescriptor.get.apply(instance);
            }
            if (propertyDescriptor.value) {
              return propertyDescriptor.value;
            }
          }
          return getTarget[name];
        },
      });
    },
  });
}
