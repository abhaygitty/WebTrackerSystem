import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const ForgotPasswordForm = ({
  form, errors, onChange, onSubmit, canSubmit, isSubmitting}) => {
  return (
    <Card className='container'>
      <form action='/' onSubmit={onSubmit}>
        <h2 className='card-heading'>Forgot Password</h2>
        <div className='field-line'>
          <TextField
            floatingLabelText='Email'
            name='email'
            errorText={errors.email}
            onChange={onChange}
            value={form.email}
          />
        </div>

        <div className='button-line'>
          <RaisedButton
            type='submit'
            label={isSubmitting ? 'Submitting...' : 'Request Reset Password'}
            disabled={!canSubmit || isSubmitting}
            primary={true} />
        </div>
      </form>
    </Card>);
};

ForgotPasswordForm.propTypes = {
  form: PropTypes.shape({ email: PropTypes.string.isRequired }),
  errors: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  canSubmit: PropTypes.bool,
  isSubmitting: PropTypes.bool
};

export default ForgotPasswordForm;
