import sinon from 'sinon';
import makeStateful from '../src/index';

require('should');

describe('makeStateful', () => {
  it('should be a function', () => {
    makeStateful.should.be.type('function');
  });
});

describe('An Extended Class', () => {
  let TestClass;

  beforeEach(() => {
    TestClass = makeStateful(class {});
  });

  describe('#addState(stateName, stateDefinition)', () => {
    it('should be a function', () => {
      TestClass.addState.should.be.type('function');
    });

    it('adds a state to the possible states', () => {
      const testInstance = new TestClass();
      testInstance.gotoState.bind(testInstance, 'TestState').should.throw();
      TestClass.addState('TestState', {});
      testInstance.gotoState.bind(testInstance, 'TestState').should.not.throw();
    });
  });

  describe('A makeStateful Instance', () => {
    let testInstance;

    beforeEach(() => {
      const TestState = {
        enterState: sinon.spy(),
        testProperty: sinon.spy(),
        exitState: sinon.spy(),
      };
      TestClass.addState('TestState', TestState);
      testInstance = new TestClass();
    });

    describe('#gotoState', () => {
      it('should be a function', () => {
        testInstance.gotoState.should.be.type('function');
      });

      it('should throw when going to an undefined state', () => {
        testInstance.gotoState.bind(testInstance, 'NotAState').should.throw();
      });

      it('adds properties from the state definition to the instance', () => {
        testInstance.should.not.have.property('testProperty');
        testInstance.gotoState('TestState');
        testInstance.should.have.property('testProperty');
      });

      it('returns to the base state when called without a state name', () => {
        testInstance.gotoState('TestState');
        testInstance.should.have.property('testProperty');
        testInstance.gotoState();
        testInstance.should.not.have.property('testProperty');
      });

      it('calls the transition callbacks if they exist', () => {
        testInstance.gotoState('TestState');
        const { enterState } = testInstance;
        const { exitState } = testInstance;
        enterState.calledOnce.should.eql(true);
        testInstance.gotoState();
        exitState.calledOnce.should.eql(true);
      });

      it('passes its arguments to the transition callbacks', () => {
        const testArgument = 'test argument';
        testInstance.gotoState('TestState', testArgument);
        testInstance.enterState.calledWith(testArgument).should.eql(true);
      });
    });
  });

  describe('Multiples makeStateful Instances', () => {
    let testInstances;

    beforeEach(() => {
      TestClass.addState('TestState1', {
        enterState: sinon.spy(),
        testProperty1: sinon.spy(),
        exitState: sinon.spy(),
      });
      TestClass.addState('TestState2', {
        enterState: sinon.spy(),
        testProperty2: sinon.spy(),
        exitState: sinon.spy(),
      });

      testInstances = new Array(5);
      for (let i = 0; i < testInstances.length; i += 1) {
        testInstances[i] = new TestClass();
      }
    });

    describe('#gotoState', () => {
      it('only sets the current state for the instance on which it was called', () => {
        const testInstance1 = testInstances[0];
        testInstance1.gotoState('TestState1');
        testInstance1.should.have.property('testProperty1');

        const testInstance2 = testInstances[1];
        testInstance2.gotoState('TestState2');
        testInstance1.should.have.property('testProperty1');
        testInstance2.should.have.property('testProperty2');

        testInstance1.gotoState('TestState2');
        testInstance1.should.not.have.property('testProperty1');
        testInstance1.should.have.property('testProperty2');
      });
    });
  });
});
