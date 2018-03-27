/**
 * Created by pzheng on 24/05/2017.
 */
/* Thanks to nross83 at
 https://stackoverflow.com/questions/34304335/redux-using-async-middlewares-vs-dispatching-actions-on-success-functions
 */
import fetch from 'isomorphic-fetch';

function isRequest({ promise }) {
  return promise && typeof promise === 'function';
}

/*function isPromise(value) {
  if (value !== null && typeof value === 'object') {
    return value && typeof value.then === 'function';
  }
  return false;
}*/

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  else {
    const error = new Error(response.statusText || response.status);
    throw error;
  }
}

function parseJSON(response) {
  return response.text().then((text) => {
    return text ? JSON.parse(text) : {};
  });
}

function makeRequest(urlBase, { promise, types, ...rest }, next) {
  const [ REQUEST, SUCCESS, FAILURE ] = types;

  // console.log('ApiMIDDLEWARE makeRequest is called');
  // Dispatch your request action so UI can showing loading indicator
  next({ ...rest, type: REQUEST });

  const api = (url, params = {}) => {
    // fetch by default doesn't include the same-origin header. Add this by default.
    params.credentials = 'same-origin';
    params.method = params.method || 'get';
    params.headers = params.headers || {};
    params.headers['Content-Type'] = 'application/json';
    params.headers['Access-Control-Allow-Origin'] = '*';
    params.headers['Access-Control-Allow-Credentials'] = true;

    return fetch(( urlBase + url), params)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => {
        // Dispatch your success action
        next({ ...rest, payload: data, type: SUCCESS });
      })
      .catch(error => {
        // Dispatch your failure action
        // console.log('error in the middleware', error);
        next({...rest, error, type: FAILURE});
      });
  };
  return promise(api);
}

export default function apiMiddleware(urlBase) {
    return store => next => action => { // eslint-disable-line no-unused-vars
      return isRequest(action) ? makeRequest(urlBase, action, next) : next(action);
    };
}
