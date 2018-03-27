import * as types from './actionTypes';
import fetch from 'isomorphic-fetch';

export function beginForgotPasswordRequest(email) {
  return { type: types.FORGOT_PASSWORD_REQUEST, email: email };
}

export function getForgotPasswordToken({email}) {
  return { type: types.FORGOT_PASSWORD_REQUEST, email };
}

export function forgotPasswordRequestSuccess(message) {
  return { type: types.FORGOT_PASSWORD_REQUEST_SUCCESS, message };
}

export function forgotPasswordRequestFailure(error) {
  return {
    type: types.FORGOT_PASSWORD_REQUEST_FAILURE,
    payload: error,
    error: true
  };
}

export function forgotPasswordRequest({email}) {
  return function(dispatch /*,getState*/) {
    // console.log('email', email);
    dispatch(beginForgotPasswordRequest(email));
    const request = new Request(`${API_URL}/auth/forgot-password`, {
      method: 'post',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ email })
    });
    return fetch(request)
      .then(
        response => {
          if (!response.ok) {
            // console.log('response.json()', response.json());
            dispatch(forgotPasswordRequestFailure(response.statusText));
            throw Error(response.statusText);
          }
          dispatch(forgotPasswordRequestSuccess(`Request sent to ${email}`));
        },
        error => {
          dispatch(forgotPasswordRequestFailure(error));
          throw(error);
        }
      );
  };
}

export function beginResetPasswordRequest(token) {
  return { type: types.RESET_PASSWORD_REQUEST, resetToken: token };
}

export function resetPasswordRequestSuccess(message) {
  return { type: types.RESET_PASSWORD_REQUEST_SUCCESS, message };
}

export function resetPasswordRequestFailure(error) {
  return { type: types.RESET_PASSWORD_REQUEST_FAILURE, payload: error, error: true };
}

export function resetPasswordRequest(token, { password }) {
  return function(dispatch /*,getState*/) {
    dispatch(beginResetPasswordRequest(token));
    const request = new Request(`${API_URL}/auth/reset-password/${token}`, {
      method: 'post',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ userpass: password })
    });
    return fetch(request)
      .then(
        response => {
          if (!response.ok) {
            dispatch(resetPasswordRequestFailure(response.statusText));
            throw Error(response.statusText);
          }
          dispatch(resetPasswordRequestSuccess('Password has been changed successfully'));
        },
        error => {
          dispatch(resetPasswordRequestFailure(error));
          throw(error);
        }
      );
  };
}
