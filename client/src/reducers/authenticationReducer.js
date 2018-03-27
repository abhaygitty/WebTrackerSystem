import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function forgotPasswordReducer(state = initialState.auth, action) {
  switch (action.type) {
    case types.FORGOT_PASSWORD_REQUEST:
      return {...state, email: action.email, submitting: true};
    case types.FORGOT_PASSWORD_REQUEST_SUCCESS:
      return {...state, message: action.message, submitting: false};
    case types.FORGOT_PASSWORD_REQUEST_FAILURE:
      return {...state, error: action.payload.message, submitting: false};
    case types.RESET_PASSWORD_REQUEST:
      return {...state, email: action.email, submitting: true};
    case types.RESET_PASSWORD_REQUEST_SUCCESS:
      return {...state, message: action.message, submitting: false};
    case types.RESET_PASSWORD_REQUEST_FAILURE:
      return {...state, error: action.payload.message, submitting: false};
  }
  return state;
};
