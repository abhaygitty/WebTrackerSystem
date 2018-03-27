import { compose, withState, mapProps } from 'recompose';
import { keys, isEmpty, values } from 'lodash';
import { every, get, set, curry, pick, pickBy } from 'lodash/fp';
import getErrors from '../../utils/validate';

const checkCanSubmit = compose(
  every(isEmpty),
  values
);

export default (validationRules, initialFormState) => Component => compose(
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('state', 'updateState', () => {
    // console.log('formStateSetter', formStateSetter);
    return {
      form: {...initialFormState},
      errors: {},
      touched: {}
    };
  }),
  withState('canSubmit', 'setCanSubmit', ({ state }) => compose(
    checkCanSubmit,
    getErrors
  )(get('form', state), validationRules)),
  mapProps(({ updateState, state, setCanSubmit, ...rest}) => ({
    onChange: curry((name, value) =>
      updateState( state => {
        const newState = compose(
          set(['form', name], value),
          set(['touched', name], true)
        )(state);

        const touched = compose(
          keys,
          pickBy(Boolean)
        )(get('touched', state));

        //console.log('touched', touched);

        const errors = getErrors(get('form', newState), validationRules);
        setCanSubmit(checkCanSubmit(errors));
        const visibleErrors = pick(touched, errors);
        // console.log('visibleErrors', visibleErrors);
        const stateReturned = set('errors', visibleErrors, newState);
        // console.log('stateReturned', stateReturned);
        return stateReturned;
        //return newState;
      })
    ),
    form: get('form', state),
    errors: get('errors', state),
    ...rest
  }))
)(Component);





