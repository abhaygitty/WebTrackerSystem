/* eslint-disable import/default */

// import 'babel-polyfill';
import './polyfills';
import React from 'react';
import {render} from 'react-dom';
import {browserHistory} from 'react-router';
import {AppContainer} from 'react-hot-loader';
import Root from './components/Root';

import configureStore from './store/configureStore';
// import {loadClients} from './actions/clientActions';
require('./favicon.ico'); // Tell webpack to load favicon.ico
import './styles/effects';
import {syncHistoryWithStore} from 'react-router-redux';

global.React = React;

const store = configureStore();

//store.dispatch(loadClients());

// Create an enhanced history that syncs navigation events with the product
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState(state) {
    // console.log(state.routing.locationBeforeTransitions);
    return state.routing;
  }
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NewRoot = require('./components/Root').default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
