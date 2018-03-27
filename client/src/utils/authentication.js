/**
 * Created by pzheng on 16/03/2017.
 */
export default {
  /**
   *  Authenticate a user. Save a token string in Local Storage
   *
   *  @param {string} token
   */
  authenticateUser(token) {
    localStorage.setItem('token', token);
  },

  /**
   * Check if a user is authenticated - check if a token is saved in the Local Storage
   *
   * @returns {boolean}
   */
  isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  },

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  deauthenticateUser() {
    localStorage.removeItem('token');
  },

  /**
   *  Get a token value.
   *
   *  @return {string}
   */

  getToken() {
    return localStorage.getItem('token');
  },
};
