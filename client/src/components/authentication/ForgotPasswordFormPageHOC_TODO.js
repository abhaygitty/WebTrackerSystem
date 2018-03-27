import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {getForgotPasswordToken} from '../../actions/authenticationActions';
import ForgotPasswordForm from './ForgotPasswordFormHOC_TODO';
import {connect} from 'react-redux';

class ForgotPasswordFormPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      form: {},
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log('this.props.canSubmit', this.props.canSubmit);
    event.preventDefault();
    if(!this.props.canSubmit) {
      return;
    }

    this.props.setIsSubmitting(true);
    this.props.actions.getForgotPasswordToken(this.props.form.email);
    // doThingForFormSubmission(form)
    //   .then(() =>
    //     setIsSubmitting(false);
    //   )
    //   .catch(error => {
    //     setIsSubmitting(false)
    //     console.warn(error)
    //   })
  }

  render() {
    console.log('this.props.canSubmit',this.props.canSubmit);
    return (
      <ForgotPasswordForm
        onSubmit={this.handleSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  // console.log('ownProps', ownProps);
  return {
    email: state.email,
    errorMessage: state.error,
    message: state.message,
    authenticated: state.authenticated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(getForgotPasswordToken, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordFormPage);
