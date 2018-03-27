import {
  FETCH_FEECATS, FETCH_FEECATS_SUCCESS, FETCH_FEECATS_FAILURE
} from '../constants';
import Auth from '../utils/authentication';

const headerWithAuthentication = {
  "Accept": "application/json",
  "Authorization": Auth.getToken(),
  "Content-Type": "application/json",
};

export function fetchFeeCats() {
  const params = {
    method: "get",
    headers: headerWithAuthentication
  };
  // console.log('ACTION fetchFeeCats triggered');
  return {
    types: [ FETCH_FEECATS, FETCH_FEECATS_SUCCESS, FETCH_FEECATS_FAILURE ],
    promise: api => api(`/api/feecat`, params)
  };
}
