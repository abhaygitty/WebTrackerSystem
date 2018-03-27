import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import ClientContactDetailComponent from './ContactDetail';
import Helper from '../../utils/utils';
import _ from 'lodash';
import $ from 'jquery';
import Auth from '../../utils/authentication';

class CreateClientContact extends Component {
  constructor(props, context) {
    super(props, context);

    const successMessage = Helper.getSuccessMessage();

    this.state = {
      contact: {
        salutation: '',
        primarycontact: 0,
        cid: this.props.params.id,
        surname: '',
        givenname: '',
        jobdescription: '',
        phone: '',
        fax: '',
        mobile: '',
        email: '',
        notes: ''
      },
      successMessage: successMessage,
      showError: false,
      errors: {}
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.serverRequest)
      this.serverRequest.abort();
  }

  handleChange(event, x) {
    const field = event.target.name;
    const value = event.target.type === 'checkbox' ?
      x :
      event.target.value;

    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      contact: {
        [field]: { $set: value }
      }
    });

    // newState.errors = validator.execute(newState, fieldValidations);
    this.setState(newState);
  }

  handleSave(event) {
    event.preventDefault();

    this.handleChange(event);
    let newState = Object.assign({}, this.state, {showError: true});
    this.setState(newState);

    if (_.isEmpty(this.state.errors) === false) { return; }
    this.postNewContent();
  }

  postNewContent() {
    this.serverRequest = $.ajax({
      type: "POST",
      url: `${API_URL}/api/contacts/create`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.contact),
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
        // console.log('data in ajax response', data);
        const contact = data;
        this.setState({contact});
        this.context.router.replace(`/clients/update/${this.props.params.id}/contacts`);
      })
      .fail(error=>{
        // console.log('error in ajax', error);
        let errorsSet = error ? error : {};
        errorsSet.summary = error.message;

        this.setState({
          errors: errorsSet
        });

        if (error.status === 401 && error.statusText === 'Unauthorized') { // Token Expired
          Auth.deauthenticateUser();
          localStorage.removeItem('token');
          this.context.router.replace('/login');
        }
      });
  }

  render() {
    // console.log("this.state.contact", this.state.contact);
    const { contact, successMessage, errors, showError } = this.state;
    return (<ClientContactDetailComponent
      contact={contact}
      onSubmit={this.handleSave}
      successMessage={successMessage}
      onChange={this.handleChange}
      errors={errors}
      showError={showError}
      actionMode={"create"}
    />);
  }
}

CreateClientContact.contextTypes = {
  router: PropTypes.object.isRequired
};

CreateClientContact.propTypes = {
  params: PropTypes.object.isRequired
};

export default CreateClientContact;
