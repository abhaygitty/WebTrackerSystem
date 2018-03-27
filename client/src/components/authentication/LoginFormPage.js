import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import _ from 'lodash';
import LoginForm from './LoginForm';
import Validator from '../../validations/validator';
import ValidationRules from '../../validations/rules';
import Auth from '../../utils/authentication';
import Helper from '../../utils/utils';

const fieldValidations = [
  Validator.create('user', 'username', 'User Name', ValidationRules.required),
  Validator.create('user', 'password', 'Password', ValidationRules.required)
];

class LoginPage extends Component {
  constructor(props) {
    super(props);

    const successMessage = Helper.getSuccessMessage();

    this.state = {
      successMessage: successMessage,
      showError: false,
      errors: {},
      user: {
        username: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  componentDidMount() {

    // Run validations on initial state
    this.setState({ errors: Validator.run(this.state, fieldValidations) });
  }

  handleValidation() {
    let currentState = Object.assign({}, this.state);
    let errors = Validator.run(currentState, fieldValidations);
    let newState = Object.assign({}, this.state, { errors, showError: true });
    this.setState(newState);
  }

  changeUser(event) {
    const field = event.target.name;

    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      user: {
        [field]: {$set: event.target.value}
      },
      showError: {$set: false}
    });

    this.setState(newState);
  }

  processForm(event) {
    event.preventDefault();
    this.handleValidation();
    if (_.isEmpty(this.state.errors) === false) { return; }
    this.resetStateAfterFetch();
  }

  resetStateAfterFetch() {

    const request = new Request(`${API_URL}/auth/login`, {
        method: 'post',
        mode: 'cors',
        redirect: 'follow',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          username: this.state.user.username,
          password: this.state.user.password
        })
      }
    );

    fetch(request).then(response => {
      // console.log('fetching with response', response);
      if (response.status === 200) {
        //success
        this.setState({
          errors:{}
        });

        response.json().then(jwt => {
          // console.log('jwt', jwt);
          // save the token
          Auth.authenticateUser(jwt.token);
          // console.log('The form is valid, and token is received', jwt.token);
          // change the current URL to /
          this.context.router.replace('/');
        });
      } else { // local authentication failure 400 / 401
        response.json().then( errors => {
          // console.log('errors', errors);
          // failure
          // change the component state
          let errorsSet = errors ? errors : {};
          errorsSet.summary = errors.message;

          this.setState({
            errors: errorsSet
          });
        });
      }
    }).catch( error => {
      let errors;
      errors.summary = error.message;
      this.setState({
        errors
      });
    });
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        onBlur={this.handleValidation}
        showError={this.state.showError}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LoginPage;
