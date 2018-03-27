import { FETCH_FEECATS, FETCH_FEECATS_SUCCESS, FETCH_FEECATS_FAILURE } from '../constants';

const initialState = {
  data: [],
  dataFetched: false,
  isFetching: false,
  error: null
};

export default function feeCatsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FEECATS:
      return {
        ...state,
        dataFetched: false,
        isFetching: true
      };
    case FETCH_FEECATS_SUCCESS:
      return {
        ...state,
        data: action.payload,
        dataFetched: true,
        isFetching: false
      };
    case FETCH_FEECATS_FAILURE:
      return {
        ...state,
        dataFetched: false,
        isFetching: false,
        error: action.error
      };
  }
  return state;
}
