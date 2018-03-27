// rules check of validations
import ErrorMessages from './messages';
import { isEmpty } from '../utils/checks';

export default {
  required: function(value) {
    if (isEmpty(value)) {
      return ErrorMessages.isRequired;
    }
    return null;
  },
  mustMatch: function(target, field, fieldName) {
    return (text, state) => {
      let targetObject = target.length > 0 ? state[target] : state;
      console.log(`state[${target}]`, state[target]);
      return targetObject === text ? null : ErrorMessages.mustMatch(fieldName);
    };
  },
  minLength: function(length) {
    return (value) => {
      return (!isEmpty(value) && value.length < length) ? ErrorMessages.minLength((length)) : null;
    };
  },
  maxLength: function(length) {
    return (value) => {
      return (!isEmpty(value) && value.length > length) ? ErrorMessages.maxLength((length)) : null;
    };
  },
  integer: function(value) {
    if (!Number.isInteger(Number(value))) {
      return ErrorMessages.isInteger(value);
    }
    return null;
  },
  oneOf: function(enumeration) {
    return (value) => {
      if (enumeration.indexOf(value) === -1) {
        return ErrorMessages.isOneOf(enumeration);
      }
      return null;
    };
  },
  email: function(value) {
    if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return ErrorMessages.isInvalidEmail(value);
    }
    return null;
  }
};

