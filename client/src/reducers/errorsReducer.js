import { RESET_ERROR, ADD_ERROR, REMOVE_ERROR } from '../constants';

export default function errors(state = [], action) {

  switch(action.type) {
    case ADD_ERROR:
      return state.concat([action.error]);
    case REMOVE_ERROR:
      return state.filter((error, i) => i !== action.index);
    case RESET_ERROR:
      return [];
  }

  return state;
}
