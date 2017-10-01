var chai = require('chai');
var should = chai.should();

const delayedMiddleware = require('../src/middleware.js');

const middleware = delayedMiddleware;


describe('core.middlewares.delayed', function () {

  // Default action
  // export function testAction(data) {
  //   return {
  //     type: TEST_ACTION,
  //     payload: {
  //       data
  //     }
  //   }
  // }

  it('should accept FSA', function () {
    const nextArgs = [];
    const fakeNext = action => { nextArgs.push(action) };
    const fakeStore = {};

    const action = { type: 'TEST' };

    middleware(fakeStore)(fakeNext)(action);

    nextArgs.should.be.eql([action]);
  });

  // Action with promise as field
  // export function testAction(data) {
  //   return {
  //     types: [TEST_ACTION, TEST_ACTION_SUCCESS, TEST_ACTION_FAIL],
  //     promise: source => source.makeSomeAction()
  //   }
  // }

  it('should accept Promise in action.promise that will be resolved', function(done) {
    const nextArgs = [];
    const fakeNext = action => { nextArgs.push(action) };
    const fakeStore = {};

    const payload = 'test data';
    const types = ['START', 'OK', null]
    const promise = () => new Promise((resolve,reject) => {
      resolve(payload)
    })

    const action = {
      types,
      promise
    }

    middleware(fakeStore)(fakeNext)(action);


    setTimeout(() => {
      nextArgs.should.deep.include.members([
        {
          type: types[0]
        },
        {
          type: types[1],
          payload
        }
      ])

      done();
    });
  });

  it('should accept Promise in action.promise that will be rejected', function(done){
    const nextArgs = [];
    const fakeNext = action => { nextArgs.push(action) };
    const fakeStore = {};

    const error = 'test error';
    const types = ['START', null, 'ERR']
    const promise = () => new Promise((resolve,reject) => {
      reject(error)
    });

    const action = {
      types,
      promise
    }

    middleware(fakeStore)(fakeNext)(action);


    setTimeout(() => {
      nextArgs.should.deep.include.members([
        {
          type: types[0]
        },
        {
          type: types[2],
          error
        }
      ]);

      done();
    });
  });

  // Action as promise
  // export function testAction(data) {
  //   return new Promise((resolve) => {
  //      resolve({
  //        type,
  //        payload
  //      })
  //   })
  // }

  it('should accept Promise as action that will be resolved', function(done) {
    const nextArgs = [];
    const fakeNext = action => { nextArgs.push(action) };
    const fakeStore = {
      dispatch: fakeNext
    };

    const payload = 'test';
    const type = 'PROMISE_CHECK';

    const action = new Promise((resolve, reject) => {
      resolve({
        type,
        payload
      })
    })

    middleware(fakeStore)(fakeNext)(action);

    setTimeout(() => {

      nextArgs.should.deep.include.members([
        {
          type,
          payload
        }
      ]);

      done();
    });
  });

  it('should accept Promise as action that will be rejected', function(done) {
    const nextArgs = [];
    const fakeNext = action => { nextArgs.push(action) };
    const fakeStore = {
      dispatch: fakeNext
    };

    const error = 'test error';
    const type = 'PROMISE_CHECK';

    const action = new Promise((resolve, reject) => {
      reject({
        type,
        error
      })
    })

    middleware(fakeStore)(fakeNext)(action);

    setTimeout(() => {

      nextArgs.should.deep.include.members([
        {
          type,
          error
        }
      ]);

      done();
    });
  });

  // Action as function
  // export function testAction(dispatch) {
  //   dispatch({
  //     type,
  //     payload
  //   });
  // };

  it('should accept function as action', function(){
    const nextArgs = [];
    const fakeNext = action => { nextArgs.push(action) };
    const fakeStore = {
      dispatch: fakeNext
    };

    const payload = 'test';
    const type = 'TEST_TYPE';

    const action = function(dispatch){
      dispatch({
        type,
        payload
      })
    };

    middleware(fakeStore)(fakeNext)(action);

    nextArgs.should.deep.include.members([
      {
        type,
        payload
      }
    ]);
  });

});
