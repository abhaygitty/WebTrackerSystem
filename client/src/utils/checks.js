export const isSome = (item, ...tests) => {
  if (Array.isArray(tests)) {
    return tests.some(test => item === test);
  }
  return false;
};

export const defined = (...items) => {
  let thisObj = this;
  if (Array.isArray(items)) {
    return items.every(item => !thisObj.isSome(item, null, undefined));
  }
  return false;
};

export const isEmpty = (value) => {
  return value === undefined || value === null || value === ''; // eslint-disable-line no-undefined
};

export const join = (rules) => {
  return (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /*first error */];
};
