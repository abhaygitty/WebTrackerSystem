import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import ClientContactDetailComponent from './ContactDetail';
import Helper from '../../utils/utils';
import _ from 'lodash';
import $ from 'jquery';
import Auth from '../../utils/authentication';

class UpdateClientContact extends Component {
  constructor(props, context) {
    super(props, context);

    const successMessage = Helper.getSuccessMessage();

    // console.log('this.props.params.contact_id', this.props.params.contact_id);
    this.state = {
      contact: {
        contact_id: this.props.params.contact_id,
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
    // console.log('this.props.params.contact_id', this.props.params.contact_id);
    this.serverRequestOnContact= $.ajax({
      type: "GET",
      url: `${API_URL}/api/contacts/${this.props.params.contact_id}`,
      contentType: "application/json",
      dataType: "json",
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
        // console.log('data in ajax response', data);
        const contact = data.contact;
        this.setState({contact});
      })
      .fail(error=>{
        // console.log('error in ajax', error);
        let errorsSet = error ? error : {};
        errorsSet.summary = error.message;

        this.setState({
          errors: errorsSet
        });

        Helper.ajaxHandler(error, this.context.router, '/login');
      });
  }

  componentWillUnmount() {
    if (this.serverRequest)
      this.serverRequest.abort();
    if (this.serverRequestOnContact)
      this.serverRequestOnContact.abort();
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

    // this.state.errors = validator.execute(this.state, fieldValidations);
    this.handleChange(event);
    let newState = Object.assign({}, this.state, {showError: true});
    this.setState(newState);

    if (_.isEmpty(this.state.errors) === false) { return; }
    // console.log('this.state.client', this.state.client);
    this.postUpdateContent();
  }

  postUpdateContent() {
    this.serverRequest = $.ajax({
      type: "POST",
      url: `${API_URL}/api/contacts/update`,
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

        Helper.ajaxHandler(error, this.context.router, "/login");
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
      actionMode={"update"}
    />);
  }
}

UpdateClientContact.contextTypes = {
  router: PropTypes.object.isRequired
};

UpdateClientContact.propTypes = {
  params: PropTypes.object.isRequired
};

export default UpdateClientContact;
