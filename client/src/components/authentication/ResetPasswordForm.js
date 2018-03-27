import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const ResetPasswordForm = ({form, errors, onChange, onSubmit, canSubmit, isSubmitting}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Reset Password</h2>
      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="New Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={form.password}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Confirm New Password"
          type="password"
          name="confirmpassword"
          onChange={onChange}
          errorText={errors.confirmpassword}
          value={form.confirmpassword}
        />
      </div>
      <div className="button-line">
        <RaisedButton
          type="submit"
          label={isSubmitting ? 'Submitting': 'Change Password'}
          disabled={!canSubmit || isSubmitting}
          primary={true} />
      </div>
    </form>
  </Card>
);

ResetPasswordForm.propTypes = {
  form: PropTypes.shape({
    password: PropTypes.string,
    confirmpassword: PropTypes.string
  }),
  errors: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  canSubmit: PropTypes.bool,
  isSubmitting: PropTypes.bool
};

export default ResetPasswordForm;
