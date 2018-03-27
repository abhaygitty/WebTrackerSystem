import React, {Component} from 'react';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import withForm from '../common/withForm';
import R from 'ramda';
import { required, email } from '../../utils/validations';

// helper
const getValue = R.path(['target', 'value']);

const validationRules = {
  email: [
    [required, 'Email should not be empty.'],
    [email, 'Email should be like ***@***.***']
  ]
};

const ForgotPasswordForm = ({
  form, errors, onChange, onSubmit, canSubmit,
  isSubmitting, message, errorMessage}) => {
  // console.log('canSubmit', canSubmit);
  // console.log('isSubmitting', isSubmitting);
  return (
    <Card className="container">
      <form action="/" onSubmit={onSubmit}>
        <h2 className="card-heading">Forgot Password</h2>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="field-line">
          <TextField
            floatingLabelText="Email"
            name="email"
            errorText={errors.email}
            onChange={R.compose(onChange('email'), getValue)}
            value={form.email}
          />
        </div>

        <div className="button-line">
          <RaisedButton
            type="submit"
            label="Reset Password"
            disabled={!canSubmit || isSubmitting}
            primary={true} />
        </div>
      </form>
    </Card>);
};

const initialFormState = { email: '' };
const enhanced = withForm(validationRules, initialFormState);

export default enhanced(ForgotPasswordForm);
