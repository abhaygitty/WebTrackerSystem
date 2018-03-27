import { createLogic } from 'redux-logic';
import { LOAD_CLIENTS, LOAD_CLIENTS_CANCEL } from '../actions/actionTypes'; // End User's Action
import * as clientActions from '../actions/clientActions';

export const loadClientsLogic = createLogic({
  type: LOAD_CLIENTS,
  cancelType: LOAD_CLIENTS_CANCEL,
  latest: true,

  process( { mockclientAPI }, dispatch, done) {
    mockclientAPI.getAllClients().then(clients => {
      dispatch(clientActions.loadClientsSuccess(clients));
    }).catch(error => {
      dispatch(clientActions.loadClientsFailure(error));
    }).then(() => done());
  }
});

export default [
  loadClientsLogic
];
