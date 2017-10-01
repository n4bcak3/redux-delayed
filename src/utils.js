const { isFSA } = require('flux-standard-action');

// Babel Spread destructuring assignment
const objectWithoutProperties = function(obj, keys) {
  let target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
};

const isPromise = function(action) {
  return (
    action &&
    typeof action.then === 'function'
  );
};

const isActionWithPromise = function(action) {
  return (
    action.promise &&
    !!action.types.length
  );
}

const extendAction = function(FSA, props) {
  return Object.assign(
    {},
    FSA,
    typeof props === 'object' ? props : {}
  );
};

module.exports = {
  isFSA,
  isPromise,
  isActionWithPromise,
  objectWithoutProperties,
  extendAction
};
