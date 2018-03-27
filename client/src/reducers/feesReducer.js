import {
  FETCH_FEES, FETCH_FEES_SUCCESS, FETCH_FEES_FAILURE
} from '../constants';

const initialState = {
  data: [],
  dataFetched: false,
  isFetching: false,
  error: null
};

export default function feesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEES:
      return {
        ...state,
        data:  [],
        isFetching: true
      };
    case FETCH_FEES_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false
      };
    case FETCH_FEES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
  }
  return state;
}
