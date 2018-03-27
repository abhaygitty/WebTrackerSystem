import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import _ from 'lodash';
import SignUpForm from './SignupForm';
import Validator from '../../validations/validator';
import ValidationRules from '../../validations/rules';
import Alert from 'react-s-alert';
// import Auth from '../modules/authentication.client.modules';

const fieldValidations = [
  Validator.ruleRunner('firstname', 'First Name', ValidationRules.required),
  Validator.ruleRunner('lastname', 'Last Name', ValidationRules.required),
  Validator.ruleRunner('email', 'Email', ValidationRules.required),
  Validator.ruleRunner('username', 'User Name', ValidationRules.required),
  Validator.ruleRunner('password', 'Password', ValidationRules.required, ValidationRules.minLength(8)),
  Validator.ruleRunner('confirmpassword', 'Confirm Password', ValidationRules.required, ValidationRules.minLength(8), ValidationRules.mustMatch('password', 'Password')),
  Validator.ruleRunner('authorizationcode', 'Authorization Code', ValidationRules.required)
];

class SignUpPage extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      user: {},
      errors: {},
      touched: {},
      submitting: null,
      message: null,
      canSubmit: false,
      user: {
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirmpassword: '',
        authorizationcode: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.checkCanSubmit = this.checkCanSubmit.bind(this);
  }

  //componentDidMount() {
  //  this.setState({errors: Validator.run(this.state, fieldValidations)});
  //}
  isFormValid() {
    let formIsValid = true;
    let currentState = Object.assign({}, this.state);
    let errors = Validator.run(currentState.user, fieldValidations);
    // if (every element in errors is empty === false ) formIsValid = false;
    let newState = Object.assign({}, this.state, {errors});
    // console.log('newState in isFormValid', newState);
    this.setState(newState);
    return formIsValid;
  }

  handleChange(event) {
    const field = event.target.name;
    const value = event.target.value;
    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      user: {
        [field]: { $set: value }
      },
      touched: { [field]: { $set: true } }
    });

    const errors = Validator.run(newState.user, fieldValidations);
    const canSubmit = this.checkCanSubmit(errors);

    const fieldsTouched = Object.keys(_.pickBy(newState.touched, _.Boolean));
    const visibleErrors = _.pick(errors, fieldsTouched);
    const finalState = Object.assign({}, newState, { errors: {...visibleErrors } }, { canSubmit });

    this.setState(finalState);
  }

  checkCanSubmit(errors) {
    const values = Object.values(errors);
    return _.every(values, _.isEmpty);
  }

  handleSubmit(event) {
    event.preventDefault();
    const errors = Validator.run(this.state.user, fieldValidations);
    if (this.checkCanSubmit(errors) === false) {
      return;
    }

    this.setState({submitting: true});

    if (_.isEmpty(this.state.errors) === false) { return; }

    this.resetStateAfterFetch();
  }

  resetStateAfterFetch() {
    // console.log(this.state.user);
    const request = new Request(`${API_URL}/auth/signup`, {
        method: 'post',
        mode: 'cors',
        redirect: 'follow',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        body: JSON.stringify({
          firstname: this.state.user.firstname,
          lastname: this.state.user.lastname,
          username: this.state.user.username,
          email: this.state.user.email,
          password: this.state.user.password,
          confirmpassword: this.state.user.confirmpassword,
          authorizationcode: this.state.user.authorizationcode
        })
      }
    );

    fetch(request).then(response => {
      if (response.status === 201) {
        // success
        this.setState({
          errors:{},
          submitting: false
        });

        response.json().then(data => {
          // localStorage.setItem('successMessage', data.message);
          Alert.success(data.message);
          this.context.router.push('/login');
        });
      } else {
        // failure
        // change the component state
        response.json().then( errors => {
          // console.log('errors', errors);
          const errorsSet = errors.errors ? errors.errors : {};
          errorsSet.summary = errors.message;
          Alert.error(errorsSet.toString());

          this.setState({
            errors: errorsSet,
            submitting: false
          });
        });
      }
    });
  }

  render() {
    return (
      <SignUpForm
        user={this.state.user}
        errors={this.state.errors}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        canSubmit={this.state.canSubmit}
        isSubmitting={this.state.submitting}
      />
    );
  }
}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SignUpPage;
