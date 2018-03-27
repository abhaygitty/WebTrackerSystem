import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';

import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
/*
  redux-logic will blocks promise chain action when setting it up there, watch out to use it
 */
//import { createLogicMiddleware } from 'redux-logic';
//import rootLogic from '../logics';
//import fetch from 'isomorphic-fetch';
//import mockClientAPI from '../api/mockClientApi'; // could be replaced by fetch

//const deps = { // injected dependencies for logic
//  mockclientAPI: mockClientAPI,
//  fetch: fetch,
//};

//const logicMiddleware = createLogicMiddleware(rootLogic, deps);

function configureStoreProd(initialState) {
  const middlewares = [
    // Add other middleware on this line...
    //logicMiddleware,
    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  return createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
  ));
}

function configureStoreDev(initialState) {
  const reduxLogger = createLogger();
  const middlewares = [
    // Add other middleware on this line...
    //logicMiddleware,
    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
    reduxLogger, // logger need to be last, otherwise thunk may produce undefined action
    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant()
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares)
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;
