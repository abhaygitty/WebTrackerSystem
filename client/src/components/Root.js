import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import storeShape from '../utils/propTypes';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import routes from '../routes';
import { Router } from 'react-router';

injectTapEventPlugin();
const muiTheme = getMuiTheme();

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
          <Provider store={store}>
            <MuiThemeProvider muitheme={muiTheme}>
              <Router history={history} routes={routes} />
            </MuiThemeProvider>
          </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
