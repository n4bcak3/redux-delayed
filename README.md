# redux-delayed
Redux middleware for accepting actions with delayed dispatch

## Types of actions

Default action (as object)

```js
export function testAction() {
  return {
    type: TEST_ACTION,
    payload
  };
};
```

Action as function:

```js
export function testAction(data) {
  return dispatch => {
    dispatch({
      type,
      payload
    })
  };
};
```

Action as Promise:

```js
export function testAction(data) {
  return new Promise((resolve, reject) => {
     resolve({
       type,
       payload
     })
  });
};
```

Combined action with promise and types:

```js
export function testAction(data) {
  return {
    types: [
        TEST_ACTION, // dispatched on call
        TEST_ACTION_ON_RESOLVE, // dispatched if promise resolved
        TEST_ACTION_ON_REJECT // if rejected
    ],
    promise: () =>
        source.makeSomeAction(data)
  };
};
```

## Contributing
If something is unclear, confusing, or needs to be refactored, please let me know. Will appreciate any help :3
