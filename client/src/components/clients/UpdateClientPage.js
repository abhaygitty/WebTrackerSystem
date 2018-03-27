import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import ClientComponent from './Detail';
import Helper from '../../utils/utils';
import _ from 'lodash';
import $ from 'jquery';
import Auth from '../../utils/authentication';

class UpdateClient extends Component {
  constructor(props, context) {
    super(props, context);

    const successMessage = Helper.getSuccessMessage();

    this.state = {
      client: {
        client_id: 0,
        name: '',
        contract_expires: '',
        prepaidminutes: '0.00',
        last_allocation_rollover: '',
        email: '',
        implementation_fee: '0.00',
        reviewdate: '',
        reminder_message: '',
        reminddate: '',
        viewed: false,
        status: false
      },
      successMessage: successMessage,
      showError: false,
      errors: {}
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    // $('.page-header h1').text('Create Client');
    // console.log('this.state.expires')
    this.fetchContent();
  }

  componentWillUnmount() {
    if (this.serverRequestGetClient)
      this.serverRequestGetClient.abort();
    if (this.serverRequestUpdateClient)
      this.serverRequestUpdateClient.abort();
  }

  handleChange(event, x) {
    // console.log('handleChange, event.target.name', event.target.name);
    const field = event.target.name;
    let value = event.target.value;
    if (event.target.type === 'checkbox')
      value = x;

    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      client: {
        [field]: { $set: value }
      }
    });

    // newState.errors = validator.execute(newState, fieldValidations);
    this.setState(newState);
  }

  handleBlur(event, x) { // x is value from child
    const field = event.target.name;
    const value = x;

    // console.log('field', field);
    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      client: {
        [field]: {$set: value}
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
    this.postNewContent();
  }

  fetchContent() {
    this.serverRequestGetClient = $.ajax({
      type: "GET",
      url: `${API_URL}/api/clients/${this.props.params.id}`,
      contentType: "application/json",
      dataType: "json",
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((client) => {
        // console.log('client', client);
        this.setState({client});
      })
      .fail((error) => {
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

  postNewContent() {
    this.serverRequestUpdateClient = $.ajax({
      type: "POST",
      url: `${API_URL}/api/clients/update`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.client),
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done(data=>{
        // console.log('data in ajax response', data);
        const client = data;
        this.setState({client});
        this.context.router.replace('/clients');
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
    // console.log("this.state.client", this.state.client);
    return (<ClientComponent
      client={this.state.client}
      onSubmit={this.handleSave}
      successMessage={this.state.successMessage}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      errors={this.state.errors}
      showError={this.state.showError}
      actionMode={"modify"}
    />);
  }
}

UpdateClient.contextTypes = {
  router: PropTypes.object.isRequired
};

UpdateClient.propTypes = {
  params: PropTypes.object.isRequired
};

export default UpdateClient;

