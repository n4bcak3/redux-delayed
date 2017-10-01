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

const _extends = Object.assign;

module.exports = {
  isFSA,
  isPromise,
  objectWithoutProperties,
  _extends
};
