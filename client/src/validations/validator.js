// to construct a runner function that takes the updated state and
// runs the specified valiations against said state
// Thanks to Jordan Schaenzle at https://spin.atomicobject.com/2016/10/05/form-validation-react
// https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/utils/validation.js

export default {
  create(target, field, name, ...rules) { // objectName is target object in state
    return (state) => {
      let targetObject = target.length > 0 ? state[target] : state;
      for (let validate of rules) {
        let errorMessageFunc = validate(targetObject[field], state);
        if (errorMessageFunc) {
          return { [field]: errorMessageFunc(name) };
        }
      }
      return null; // no error
    };
  },
  ruleRunner(field, name, ...rules) { /* original function*/
    return (state) => {
      for (let validate of rules) {
        let errorMessageFunc = validate(state[field], state);
        if (errorMessageFunc) {
          return {[field]: errorMessageFunc(name)};
        }
      }
      return null;
    };
  },
  run(state, fieldValidations) { // create an Array by create function
    return fieldValidations.reduce((memo, fieldValidation) => {
      return Object.assign(memo, fieldValidation(state)); // merging all results, see function create' return(state)=> ... '
    }, {}); // initial value
  }
};
