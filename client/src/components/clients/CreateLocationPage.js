import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import ClientLocationDetailComponent from './LocationDetail';
import Helper from '../../utils/utils';
import _ from 'lodash';
import $ from 'jquery';
import Auth from '../../utils/authentication';

class CreateClientLocation extends Component {
  constructor(props, context) {
    super(props, context);

    const successMessage = Helper.getSuccessMessage();

    this.state = {
      location: {
        title: '',
        cidref: this.props.params.id,
        typeref: 'R',
        addresstype: '',
        type_inst: '',
        address1: '',
        address2: '',
        suburb: '',
        state: '',
        postcode: '',
        startdate: '',
        notes: ''
      },
      locationTypes: [],
      successMessage: successMessage,
      showError: false,
      errors: {}
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectFieldChange = this.handleSelectFieldChange.bind(this);
  }

  componentDidMount() {
    this.serverRequestOnTypes= $.ajax({
      type: "GET",
      url: `${API_URL}/api/locationtypes`,
      contentType: "application/json",
      dataType: "json",
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
        // console.log('data in ajax response', data);
        const locationTypes = data.locationTypes;
        this.setState({locationTypes});
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

  componentWillUnmount() {
    if (this.serverRequest)
      this.serverRequest.abort();
    if (this.serverRequestOnTypes)
      this.serverRequestOnTypes.abort();
  }

  handleChange(event, x) {
    const field = event.target.name;
    const value = event.target.type === 'checkbox' ?
      x :
      event.target.value;

    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      location: {
        [field]: { $set: value }
      }
    });

    // newState.errors = validator.execute(newState, fieldValidations);
    this.setState(newState);
  }

  handleSelectFieldChange(event, index, value) {
    let newState = update(this.state, {
      location: {
        typeref: { $set: value }
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

  postNewContent() {
    this.serverRequest = $.ajax({
      type: "POST",
      url: `${API_URL}/api/locations/create`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.location),
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
        // console.log('data in ajax response', data);
        const location = data;
        this.setState({location});
        this.context.router.replace(`/clients/update/${this.props.params.id}/locations`);
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
    // console.log("this.state.location", this.state.location);
    const {location, locationTypes, successMessage, errors, showError} = this.state;
    return (<ClientLocationDetailComponent
      location={location}
      locationTypes={locationTypes}
      onSelectFieldChange={this.handleSelectFieldChange}
      onSubmit={this.handleSave}
      successMessage={successMessage}
      onChange={this.handleChange}
      errors={errors}
      showError={showError}
      actionMode={"create"}
    />);
  }
}

CreateClientLocation.contextTypes = {
  router: PropTypes.object.isRequired
};

CreateClientLocation.propTypes = {
  params: PropTypes.object.isRequired
};

export default CreateClientLocation;
