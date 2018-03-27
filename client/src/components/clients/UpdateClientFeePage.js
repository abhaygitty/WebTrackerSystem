import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import ClientFeeDetailComponent from './FeeDetail';
import Helper from '../../utils/utils';
import _ from 'lodash';
import $ from 'jquery';
import Auth from '../../utils/authentication';

class UpdateClientFee extends Component {
  constructor(props, context) {
    super(props, context);

    const successMessage = Helper.getSuccessMessage();

    this.timeouts = [];

    this.state = {
      fee: {
        annualfee: '',
        cfee_id: 0,
        cidref: this.props.params.id,
        feecatdesc: '',
        feecategories_id: '',
        freqdesc: '',
        freqtype: '',
        fromdate: '',
        notes: '',
        reviewdate: ''
      },
      feeCats: [],
      freqTypes: [],
      successMessage: successMessage,
      showError: false,
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFeeCatChange = this.handleFeeCatChange.bind(this);
    this.handleFreqTypeChange = this.handleFreqTypeChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    this.fetchFeeCats();
    this.fetchFreqTypes();
    this.fetchFee();


  }

  componentWillUnmount() {
    if (this.serverRequest)
      this.serverRequest.abort();
    if (this.serverRequestOnFee)
      this.serverRequestOnFee.abort();
    if (this.serverRequestOnFeeCats)
      this.serverRequestOnFeeCats.abort();
    if (this.serverRequestOnFreqTypes)
      this.serverRequestOnFreqTypes.abort();
    if (this.timeouts) {
      this.timeouts.forEach(clearTimeout);
    }
  }

  fetchFee() {
    this.serverRequestOnFee= $.ajax({
      type: "GET",
      url: `${API_URL}/api/fees/${this.props.params.fee_id}`,
      contentType: "application/json",
      dataType: "json",
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
        const fee = data;
        this.setState({fee});
      })
      .fail(error=>{
        let errorsSet = error ? error : {};
        errorsSet.summary = error.message;

        this.setState({
          errors: errorsSet
        });

        Helper.ajaxHandler(error, this.context.router, '/login');
      });
  }

  fetchFeeCats() {
    this.serverRequestOnFeeCats = $.ajax({
      type: "GET",
      url: `${API_URL}/api/feecats`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: (data) => {
        this.setState({feeCats: data});
      },
      failure: (error) => {
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
      }
    });
  }

  fetchFreqTypes() {
    this.serverRequestOnFreqTypes = $.ajax({
      type: "GET",
      url: `${API_URL}/api/freqtypes`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: (data) => {
        this.setState({freqTypes: data});
      },
      failure: (error) => {
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
      }
    });
  }

  handleFeeCatChange(event, i, value) {
    let newState = update(this.state, {
      fee: {
        feecategories_id: { $set: value }
      }
    });

    this.setState(newState);
  }

  handleFreqTypeChange(event, i, value) {
    let newState = update(this.state, {
      fee: {
        freqtype: { $set: value }
      }
    });

    this.setState(newState);
  }

  handleChange(event, x) {
    const field = event.target.name;
    const value = event.target.type === 'checkbox' ?
      x :
      event.target.value;

    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      fee: {
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
    // console.log('value', value);
    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      fee: {
        [field]: { $set: value }
      }
    });

    // newState.errors = validator.execute(newState, fieldValidations);
    this.setState(newState);
  }

  handleSubmit(event) {
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
      url: `${API_URL}/api/fees/update`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.fee),
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
        // console.log('data in ajax response', data);
        const fee = data;
        this.setState({fee});
        this.context.router.replace(`/clients/update/${this.props.params.id}/fees`);
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
    const { fee, feeCats, freqTypes, successMessage, errors, showError } = this.state;
    // console.log('fee in render', fee);
    return (<ClientFeeDetailComponent
      fee={fee}
      feeCats={feeCats}
      freqTypes={freqTypes}
      onSubmit={this.handleSubmit}
      onBlur={this.handleBlur}
      successMessage={successMessage}
      onChange={this.handleChange}
      onFeeCatChange={this.handleFeeCatChange}
      onFreqTypeChange={this.handleFreqTypeChange}
      errors={errors}
      showError={showError}
      actionMode={"modify"}
    />);
  }
}

UpdateClientFee.contextTypes = {
  router: PropTypes.object.isRequired
};

UpdateClientFee.propTypes = {
  params: PropTypes.object.isRequired
};

export default UpdateClientFee;
