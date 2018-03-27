import { FETCH_FREQTYPES, FETCH_FREQTYPES_SUCCESS, FETCH_FREQTYPES_FAILURE } from '../constants';

const initialState = {
  data: null,
  dataFetched: false,
  isFetching: false,
  error: null
};

export default function freqTypesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_FREQTYPES:
      return {
        ...state,
        dataFetched: false,
        isFetching: true
      };
    case FETCH_FREQTYPES_SUCCESS:
      return {
        ...state,
        data: action.payload,
        dataFetched: true,
        isFetching: false
      };
    case FETCH_FREQTYPES_FAILURE:
      return {
        ...state,
        dataFetched: false,
        isFetching: false,
        error: action.error
      };
  }
  return state;
}
