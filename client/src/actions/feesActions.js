import {
  RESET_NEW_FEE,
  CREATE_FEE, CREATE_FEE_SUCCESS, CREATE_FEE_FAILURE,
  UPDATE_FEE, UPDATE_FEE_SUCCESS, UPDATE_FEE_FAILURE,
  FETCH_FEE, FETCH_FEE_SUCCESS, FETCH_FEE_FAILURE,
  FETCH_FEES, FETCH_FEES_SUCCESS, FETCH_FEES_FAILURE
} from '../constants';
import Auth from '../utils/authentication';

const headerWithAuthentication = {
  "Accept": "application/json",
  "Authorization": Auth.getToken(),
  "Content-Type": "application/json",
};

export function resetNewFee() {
  return {
    type: RESET_NEW_FEE
  };
}

export function fetchFees(clientId) {
  const params = {
    method: "get",
    headers: headerWithAuthentication
  };
  // console.log('ACTION fetchFees triggered');
  return {
    types: [ FETCH_FEES, FETCH_FEES_SUCCESS, FETCH_FEES_FAILURE ],
    promise: api => api(`/api/clients/update/${clientId}/fees`, params)
  };
}

export function fetchFee(feeId) {
  const params = {
    method: "get",
    headers: headerWithAuthentication
  };
  // console.log('ACTION fetchFees triggered');
  return {
    types: [ FETCH_FEE, FETCH_FEE_SUCCESS, FETCH_FEE_FAILURE ],
    promise: api => api(`/api/fees/${feeId}`, params)
  };
}

export function updateFee(activeFee) {
  const params = {
    method: "post",
    headers: headerWithAuthentication,
    data: JSON.stringify(activeFee)
  };
  return {
    types: [ UPDATE_FEE, UPDATE_FEE_SUCCESS, UPDATE_FEE_FAILURE ],
    promise: api => api(`/api/fees/update`, params)
  };
}

export function createFee(newFee) {
  const params = {
    method: "post",
    headers: headerWithAuthentication,
    data: JSON.stringify(newFee)
  };
  return {
    types: [ CREATE_FEE, CREATE_FEE_SUCCESS, CREATE_FEE_FAILURE ],
    promise: api => api(`/api/fees/create`, params)
  };
}


