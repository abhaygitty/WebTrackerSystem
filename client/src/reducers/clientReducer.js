import { FETCH_CLIENT, FETCH_CLIENT_SUCCESS, FETCH_CLIENT_FAILURE } from '../constants';
const initialState = {
  data: null,
  dataFetched: false,
  isFetching: false,
  error: null
};

export default function clientReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CLIENT:
      return {
        ...state,
        dataFetched: false,
        isFetching: true
      };
    case FETCH_CLIENT_SUCCESS:
      return {
        ...state,
        data: action.payload,
        dataFetched: true,
        isFetching: false
      };
    case FETCH_CLIENT_FAILURE:
      return {
        ...state,
        dataFetched: false,
        isFetching: false,
        error: action.error
      };
  }
  return state;
}

