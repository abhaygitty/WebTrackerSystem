import { isEmpty } from './checks';

export const required = function(value) {
  return !isEmpty(value);
};
export const mustMatch = function(value) {
  return anotherValue => anotherValue === value;
};
export const minLength = function(len) {
  return (value) => (isEmpty(value) || value.length >= len);
};
export const maxLength = function(len) {
  return (value) => (isEmpty(value) || value.length <= len);
};
export const email = function(value) {
  return (isEmpty(value) || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value));
};
export const hasCapitalLetter = function(value) {
  return (/[A-Z]/.test(value));
};

