import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
//import clientReducer from './clientReducer';
//import errorsReducer from './errorsReducer';
//import feesReducer from './feesReducer';
//import freqTypesReducer from './freqTypesReducer';
//import feeCatsReducer from './feeCatsReducer';
/* import createNewFeeReducer from './createfee.client.reducers'; */
//import updateFeeReducer from './updateFeeReducer';
import authenticationReducer from './authenticationReducer';

//  client: clientReducer,
//  fees: feesReducer,
//  activeFee: updateFeeReducer,
//  freqTypes: freqTypesReducer,
//  feeCats: feeCatsReducer,
//  errors: errorsReducer,

const rootReducer = combineReducers({
  form: formReducer,
  auth: authenticationReducer,
  routing: routerReducer
});

export default rootReducer;
