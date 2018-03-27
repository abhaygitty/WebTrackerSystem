/**
 * Created by pzheng on 11/04/2017.
 */
import _ from 'lodash';
import moment from 'moment';
import addDays from 'date-fns/add_days';
import Auth from './authentication';

/* date-fns does not support arbitrary date format into ISO one, see
 https://github.com/date-fns/date-fns/issues/219
 */

const utils = {
  /**
   *  Obtain items based on page
   *
   *  @param {arrayOfObjects, number} token
   */
  getPaginatedItems: function (items, perPage = 10, page = 1) {
    const offset = (page - 1) * perPage;
    // const paginatedItems = _.rest(items, offset).slice(0, per_page); //this is for underscore
    const paginatedItems = _(items).drop(offset).take(perPage).value();
    return {
      page: page,
      perPage: perPage,
      total: items.length,
      totalPages: Math.ceil(items.length / perPage),
      data: paginatedItems
    };
  },

  getSuccessMessage: function () {
    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }
    return successMessage;
  },

  parseDdMmYyyyToYyyyMmDd: function (value) {
    if (!value) return '';
    return moment(value, 'DDMMYYYY').format('YYYY-MM-DD');
  },

  parseValueToAusFormat: function (value) {
    if (!value) return '';
    return moment(value, 'DDMMYYYY').format('DD/MM/YYYY');
  },

  parseClarionDateToDateObject: function (value) {
    return addDays(new Date('1800-12-28'), (!value) ? 0 : value);
  },

  isExpired: function (d) {
    const today = moment();
    const checkDay = moment(d, 'DD/MM/YYYY');
    return ( checkDay.diff(today, 'day') <= 0 );
  },

  assignDefined: function (target, ...sources) {
    for (const source of sources) {
      for (const key of Object.keys(source)) {
        const val = source[key];
        if (val !== undefined) {
          target[key] = val;
        }
      }
    }
    return target;
  },

  ajaxHandler: function (error, router, forwardTo) {
    if (error && error.status === 401 && error.statusText === 'Unauthorized') { // Token Expired
      Auth.deauthenticateUser();
      localStorage.removeItem('token');
      if (forwardTo && router) {
        router.replace(forwardTo);
      }
    }
  },
};

export default utils;
