import { createLogic } from 'redux-logic';
import { REQUEST_FORGOT_PASSWORD_TOKEN, REQUEST_FORGOT_PASSWORD_TOKEN_CANCEL} from '../actions/actionTypes'; // End User's Action
import * as authActions from '../actions/authenticationActions';

export const getForgotPasswordTokenLogic = createLogic({
  type: REQUEST_FORGOT_PASSWORD_TOKEN,
  cancelType: REQUEST_FORGOT_PASSWORD_TOKEN_CANCEL,
  latest: true,

  process( { fetch, getState }, dispatch, done) {
    const state = getState();
    // console.log('state', state);
    const { email } = state.auth;
    // console.log('email', email);
    const request = new Request(`${API_URL}/auth/forgot-password`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ email })
    });
    fetch(request).then(response => {
      if (response.ok === true)
        dispatch(authActions.requestForgotPasswordTokenSuccess('Request Sent'));
      else
        dispatch(authActions.requestForgotPasswordTokenFailure(`Error occurred. ${response.status}`));
    }).catch(error => {
      dispatch(authActions.requestForgotPasswordTokenFailure(error));
    }).then(() => done());
  }
});

export default [
  getForgotPasswordTokenLogic
];
