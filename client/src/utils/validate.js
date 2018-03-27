/*
  Reference: https://medium.com/javascript-inside/form-validation-as-a-higher-order-component-pt-2-1edb7881870d
 */

import R from 'ramda';
import Either from 'data.either';
import { isArray } from 'lodash';
import { compose, map, mapValues, mergeWith, get, pickBy } from 'lodash/fp';

/*
 const inputData = { name: 'FooBar', random: 'test };
 // validations
 const hasCapitalLetter = a => /[A-Z]/.test(a)
 const isGreaterThan = R.curry((len, a) => (a > len))
 const isLengthGreaterThan = len => R.compose(isGreaterThan(len), R.prop('length'))

// Example
const validationRules = {
  name: [
    [ isLengthGreaterThan(5),
      `Minimum Name length of 6 is required.`
    ],
  ],
  random: [
    [ isLengthGreaterThan(7), 'Minimum Random length of 8 is required.' ],
    [ hasCapitalLetter, 'Random should contain at least one uppercase letter.' ],
  ]
};
*/

/* Ramda way */
export const validate = (inputData, validationRules) => {
  const { Right, Left } = Either;
  const makePredicate = ([predFn, e]) => a => predFn(a) ? Right(a) : Left(e);

  const makePredicates = R.map(makePredicate);

  const runPredicates = ([input, validations]) =>
    R.map(predFn => predFn(input), makePredicates(validations));

  const validate = R.map(R.compose(R.sequence(Either.of), runPredicates));

  const makeValidationObject = R.mergeWithKey((k, l, r) => [l, r]);

  const getErrors = R.compose(validate, makeValidationObject);

  const displayError = result =>
    result.cata({
      Right: a => null, // eslint-disable-line no-unused-vars
      Left: errorMsg => errorMsg
    });

  return R.map(displayError, getErrors(inputData, validationRules));
};

/* lodash/fp way */
const getErrors = (function() {
  const makePredicate = ([test, errorMsg]) => a =>
    test(a) ? null : errorMsg;

  const makePredicates = map(makePredicate);

  const runPredicates = ({ input, validations }) =>
    map(predFn => predFn(input), makePredicates(validations));

  const validate = mapValues(runPredicates);

  const makeValidationObject = mergeWith((input, validations) =>
    ({ input, validations }));

  const filterWithValidation = pickBy(compose(isArray, get('validations')));

  const errorMessage = result =>
    result.filter(error => error !== null).join(', ');

  const getErrors = compose(
    mapValues(errorMessage),
    validate,
    filterWithValidation,
    makeValidationObject
  );
  return getErrors;
}());

export default getErrors;

