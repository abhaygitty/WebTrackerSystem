import {
  UPDATE_FEE, UPDATE_FEE_SUCCESS, UPDATE_FEE_FAILURE
} from '../constants';

const initialState = {
  data: null,
  dataFetched: false,
  isFetching: false,
  error: null
};

export default function updateFeeReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FEE:
      return {
        ...state,
        data: null,
        dataFetched: false,
        isFetching: true
      };
    case UPDATE_FEE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        dataFetched: true,
        isFetching: false,
        error: null
      };
    case UPDATE_FEE_FAILURE:
      return {
        ...state,
        data: null,
        error: action.error,
        dataFetched: false,
        isFetching: false
      };
    default:
      return state;
  }
}
