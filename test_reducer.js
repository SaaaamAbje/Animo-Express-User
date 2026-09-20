import { legacy_createStore as createStore } from 'redux';

// 1. Reducer implementation
const initialState = {
  'counter we value': 0,
  'show list': false,
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        'counter we value': state['counter we value'] + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        'counter we value': state['counter we value'] - 1,
      };
    default:
      return state;
  }
}

// 6. Use legacy_createStore
const store = createStore(counterReducer);

// Helper for testing
function assert(condition, message) {
  if (!condition) {
    console.error('FAILED: ' + message);
  } else {
    console.log('PASSED: ' + message);
  }
}

// 2. Test INCREMENT
console.log('Testing INCREMENT...');
store.dispatch({ type: 'INCREMENT' });
assert(store.getState()['counter we value'] === 1, 'Counter should be 1 after one INCREMENT');

// 4. Test DECREMENT
console.log('Testing DECREMENT...');
store.dispatch({ type: 'DECREMENT' });
assert(store.getState()['counter we value'] === 0, 'Counter should be 0 after one DECREMENT');

// 3. Test Unknown Action
console.log('Testing UNKNOWN...');
const previousState = store.getState();
store.dispatch({ type: 'UNKNOWN' });
assert(store.getState() === previousState, 'State should remain the same for unknown action');

console.log('Final State:', store.getState());
