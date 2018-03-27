// import {join} from '../utils/utils';

export default {
  isRequired(fieldName) {
    return (`${fieldName} is required`);
  },
  mustMatch(otherFieldName) {
    return (fieldName => `${fieldName} must match ${otherFieldName}`);
  },
  minLength(length) {
    return (fieldName => `${fieldName} must be at least ${length} characters`);
  },
  isInvalidEmail(fieldName) {
    return (() => `${fieldName} is an invalid email address`);
  },
  maxLength(length) {
    return (fieldName => `${fieldName} must be no more than ${length} characters`);
  },
  isInteger(value) {
    return (() => `${value} must be an integer`);
  },
  isOneOf(enumeration) {
    return (value => `${value} must be one of ${enumeration.join(', ')}`);
  }
};



