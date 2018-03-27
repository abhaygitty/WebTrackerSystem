import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const SignUpForm = ({user, errors, onChange, onSubmit, canSubmit, isSubmitting}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign Up</h2>
      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="First Name"
          name="firstname"
          errorText={errors.firstname}
          onChange={onChange}
          value={user.firstname}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Last Name"
          name="lastname"
          errorText={errors.lastname}
          onChange={onChange}
          value={user.lastname}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="User Name"
          name="username"
          errorText={errors.username}
          onChange={onChange}
          value={user.username}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Confirm Password"
          type="password"
          name="confirmpassword"
          onChange={onChange}
          errorText={errors.confirmpassword}
          value={user.confirmpassword}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Authorization Code"
          name="authorizationcode"
          errorText={errors.authorizationcode}
          onChange={onChange}
          value={user.authorizationcode}
        />
      </div>

      <div className="button-line">
        <RaisedButton
          type="submit"
          label={isSubmitting ? 'Submitting': 'Create New Account'}
          disabled={!canSubmit || isSubmitting}
          primary={true} />
      </div>
      <CardText>
        Already have an account?
        <Link to={'/login'}>
          Log in
        </Link>
      </CardText>
    </form>
  </Card>
);

SignUpForm.propTypes = {
  user: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    confirmpassword: PropTypes.string,
    authorizationcode: PropTypes.string
  }),
  errors: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  canSubmit: PropTypes.bool,
  isSubmitting: PropTypes.bool
};

export default SignUpForm;
