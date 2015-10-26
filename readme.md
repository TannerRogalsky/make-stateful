# make-stateful

make-stateful is a library that turns your JavaScript objects into self-contained state machines. The goal is to provide a flexible state machine with minimal configuration.

## API

### `makeStateful(Class)`
Extends a JS class with the functions that makeStateful requires.

### `Class.addState(stateName, stateDefinition)`
Adds a named state definition to the extended Class.

### `instance.gotoState(stateName, ...args)`
Transitions the instance to the named state. If the instance currently has a method called `exitState`, it will be called with the arguments passed. If the new state has a method called `enterState`, it will also be called with the arguments passed to `gotoState`.

## Example

```javascript
var Enemy = function(health) {
  this.health = health;
}
Enemy.prototype.speak = function() {
  return 'My health is ' + this.health;
}
makeStateful(Enemy);

Enemy.addState('Immortal', {
  speak: function() { // overridden
    return 'I am UNBREAKABLE!!';
  },

  die: function() { // added
    return 'I can not die now!'
  }
});

var peter = new Enemy(10)

peter.speak() // My health is 10
peter.gotoState('Immortal')
peter.speak() // I am UNBREAKABLE!!
peter.die() // I can not die now!
peter.gotoState()
peter.speak() // My health is 10
```
