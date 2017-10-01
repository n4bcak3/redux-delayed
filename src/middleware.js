const {
  isFSA,
  isPromise,
  objectWithoutProperties,
  isActionWithPromise,
  extendAction
} = require('./utils');

/**
 * Delayed Dispatch Middleware
 *
 * Provide functionality for delayed dispatch of the action payload.
 * Handling work with async actions invocation, pending statuses
 * and looping it data back to store
 *
 * @param  {Object}   source Helper class that will be passed
 * @return {function}        Redux Middleware
 */

const DelayedDispatchMiddleware = ({ dispatch, getState }) =>
  next => async action => {
    // If its FSA - default
    // going to next middleware
    if (isFSA(action)) {
      return next(action);
    }

    // Adding handlers if its Promise
    // Important to resolve/reject promise with FSA!
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

    // If it is function
    // execute with 2 parameters:
    // - dispatch to store function
    // - get store state function
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    // Now its not function or FSA (standard object)
    // Checking if action contain promise
    // which need to be handled
    if (!isActionWithPromise(action)) {
      return next(action);
    }

    const promise = action.promise;
    const types = action.types;

    // Destructuring types of action
    // [pending, ok, error]
    // const [REQUEST, SUCCESS, FAIL] = types;
    const REQUEST = types[0];
    const SUCCESS = types[1];
    const FAIL = types[2];

    // Separating additional fields of action with promise

    // ES5 implementation
    const actionProps = objectWithoutProperties(action, ['promise', 'types']);

    // ES6 implementation
    // const { promise, types, ...actionProps } = action;

    // Sending action indicating that promise invoked
    next(extendAction({ type: REQUEST }, actionProps));

    let __action;

    try {
      const payload = await promise(); // invoking promise

      __action = extendAction(
        {
          payload,
          type: SUCCESS
        },
        actionProps
      );
    } catch (error) {
      __action = extendAction(
        {
          type: FAIL,
          error
        },
        actionProps
      );
    };

    // Sending result action
    return next(__action);
  };

module.exports = DelayedDispatchMiddleware;
