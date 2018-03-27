import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import update from 'react-addons-update';
// import { Link } from 'react-router';
import {bindActionCreators} from 'redux';
import {forgotPasswordRequest} from '../../actions/authenticationActions';
import {connect} from 'react-redux';
import ForgotPasswordForm from './ForgotPasswordForm';
import Alert from 'react-s-alert';
import Validator from '../../validations/validator';
import ValidationRules from '../../validations/rules';

const fieldValidations = [
  Validator.ruleRunner('email', 'Email', ValidationRules.required, ValidationRules.email)
];

class ForgotPasswordFormPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      form: { email: '' },
      errors: { email: null },
      touched: { email: false },
      submitting: this.props.isSubmitting,
      message: this.props.message,
      canSubmit: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.checkCanSubmit = this.checkCanSubmit.bind(this);
  }

  isFormValid() {
    let formIsValid = true;
    let currentState = Object.assign({}, this.state);
    let errors = Validator.run(currentState.form, fieldValidations);
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
      form: {
        [field]: { $set: value }
      },
      touched: { [field]: { $set: true } }
    });

    const errors = Validator.run(newState.form, fieldValidations);
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
    const errors = Validator.run(this.state.form, fieldValidations);
    if (this.checkCanSubmit(errors) === false) {
      return;
    }

    this.setState({submitting: true});
    //ajax request here
    this.props.actions.forgotPasswordRequest(this.state.form)
      .then(()=>this.redirect())
      .catch(error => {
        Alert.error(error.toString());

        this.setState({submitting: false});
      });
  }

  redirect() {
    this.setState({submitting: false});
    Alert.success(`Request sent, please check email ${this.state.form.email}`);
    this.context.router.push('/login');
  }

  render() {
    // const {handleChange, handleSubmit, handleValidation, getValidationMessages} = this.props.actions;
    // console.log('render() this.props',this.props);
    return (
      <ForgotPasswordForm
        form={this.state.form}
        errors={this.state.errors}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        canSubmit={this.state.canSubmit}
        isSubmitting={this.state.submitting}
      />
    );
  }
}

ForgotPasswordFormPage.propTypes = {
  actions: PropTypes.shape({
    forgotPasswordRequest: PropTypes.func.isRequired
  })
};

ForgotPasswordFormPage.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state) {
  // console.log(state, 'State inside ForgotPasswordFormPage.js')
  /*
  let props;
  if ( !state.submitting ) {
    props = {
      errorMessage: state.auth.error,
      message: state.auth.message,
      authenticated: state.auth.authenticated
    };
  } else {
    props = { errorMessage: '', message: '', authenticated: false };
  }

  return props;
  */
  return {
    errorMessage: state.auth.error,
    message: state.auth.message,
    authenticated: state.auth.authenticated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      forgotPasswordRequest
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordFormPage);
