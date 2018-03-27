import {
  RESET_NEW_CLIENT, FETCH_CLIENT, FETCH_CLIENT_SUCCESS, FETCH_CLIENT_FAILURE
} from '../constants';
import * as types from './actionTypes';
import Auth from '../utils/authentication';

const headerWithAuthentication = {
  "Accept": "application/json",
  "Authorization": Auth.getToken(),
  "Content-Type": "application/json",
};

export function resetNewClient() {
  return {
    type: RESET_NEW_CLIENT
  };
}

export function fetchClient(clientId) {
  const params = {
    method: 'get',
    headers: headerWithAuthentication
  };
  // console.log('ACTION fetchClient triggered');
  return {
    types: [ FETCH_CLIENT, FETCH_CLIENT_SUCCESS, FETCH_CLIENT_FAILURE ],
    promise: api => api(`/api/clients/${clientId}`, params)
  };
}

export function loadClients() {
  return {type: types.LOAD_CLIENTS};
}

export function loadClientsSuccess(clients) {
  return {type: types.LOAD_CLIENTS_SUCCESS, clients};
}

export function loadClientsFailure(error) {
  return {type: types.LOAD_CLIENTS_FAILURE, payload: error, error: true};
}

export function loadClientsCancel() {
  return {type: types.LOAD_CLIENTS_CANCEL};
}
