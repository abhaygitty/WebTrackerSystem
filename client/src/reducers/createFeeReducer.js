import {
  RESET_NEW_FEE, CREATE_FEE, CREATE_FEE_SUCCESS, CREATE_FEE_FAILURE
} from '../constants';

const initialState = {
  data: null,
  dataFetched: false,
  isFetching: false,
  error: null
};

export default function createFeeReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_NEW_FEE:
      return {
        ...state,
        data: null,
        dataFetched: false,
        isFetching: false,
        error: null
      };
    case CREATE_FEE:
      return {
        ...state,
        data: null,
        dataFetched: false,
        isFetching: true
      };
    case CREATE_FEE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        dataFetched: true,
        isFetching: false,
        error: null
      };
    case CREATE_FEE_FAILURE:
      return {
        ...state,
        data: null,
        error: action.error,
        dataFetched: false,
        isFetching: false
      };
  }
  return state;
}
