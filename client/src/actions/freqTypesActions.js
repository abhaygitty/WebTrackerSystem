import {
  FETCH_FREQTYPES, FETCH_FREQTYPES_SUCCESS, FETCH_FREQTYPES_FAILURE
} from '../constants';
import Auth from '../utils/authentication';

const headerWithAuthentication = {
  "Accept": "application/json",
  "Authorization": Auth.getToken(),
  "Content-Type": "application/json",
};

export function fetchFreqTypes() {
  const params = {
    method: "get",
    headers: headerWithAuthentication
  };
  // console.log('ACTION fetchFreqTypes triggered');
  return {
    types: [ FETCH_FREQTYPES, FETCH_FREQTYPES_SUCCESS, FETCH_FREQTYPES_FAILURE ],
    promise: api => api(`/api/freqtypes`, params)
  };
}
