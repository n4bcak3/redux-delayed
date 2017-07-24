/**
 * Delayed Dispatch Middleware
 *
 * Provide functionality for delayed dispatch of the action payload.
 * Handling work with async actions invocation, pending statuses
 * and looping it data back to store
 */

const { isFSA } = require('flux-standard-action');

// Babel Spread destructuring assignment
const _objectWithoutProperties = function(obj, keys) { 
  let target = {}; 
  for (var i in obj) { 
    if (keys.indexOf(i) >= 0) 
      continue; 
    if (!Object.prototype.hasOwnProperty.call(obj, i)) 
      continue; 
    target[i] = obj[i]; 
  } 
  return target; 
}

const _extends = Object.assign;

const isPromise = function(action) {
  return (
    action &&
    typeof action.then === 'function'
  );
};

const delayedDispatchMiddleware = function(source) {
  return ({ dispatch, getState }) => next => async action => {
    /*
      Going to next middleware if it is a FSA
    */
    if (isFSA(action)) {
      return next(action);
    }

    if (isPromise(action)) {
      return action
        .then(({payload, type}) => {
          dispatch({
            type,
            payload
          });
        })
        .catch(({error, type}) => {
          dispatch({
            type,
            error
          });
        });
    }

    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    // Separating additional fields of action with promise
    // from flux standard action (FSA)
    
    // ES6 implementation
    // const { promise, types, ...$FSA } = action;

    const promise = action.promise;
    const types = action.types;
    const $FSA = _objectWithoutProperties(action, ['promise', 'types']);

    // Checking if action contain promise
    // which need to be handled
    if (!promise) {
      return next(action);
    }

    // Destructuring types of action
    // [pending, ok, error]
    // const [REQUEST, SUCCESS, FAIL] = types;
    const REQUEST = types[0];
    const SUCCESS = types[1];
    const FAIL = types[2];

    // Sending action indicating that promise invoked
    const requestAction = _extends({}, $FSA, {
      type: REQUEST
    });

    next(requestAction);

    try {
      // Invoking promise
      // Passing helper class Source for general prepositions
      const payload = await promise(source);
      const successAction = _extends({}, $FSA, { 
        payload,
        type: SUCCESS 
      });

      return next(successAction); 

    } catch (error) {
      const failAction = _extends({}, $FSA, {
        error,
        type: FAIL
      });

      return next(failAction);
    }
  };
};

module.exports = delayedDispatchMiddleware;
