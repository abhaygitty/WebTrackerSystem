import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import ClientEdiDetailComponent from './EdiDetail';
import Helper from '../../utils/utils';
import _ from 'lodash';
import $ from 'jquery';
import Auth from '../../utils/authentication';

class CreateClientEdi extends Component {
  constructor(props, context) {
    super(props, context);

    const successMessage = Helper.getSuccessMessage();

    this.timeouts = [];

    this.state = {
      edi: {
        edinumber: 0,
        service: '',
        cidref: this.props.params.id,
        edistring: ''
      },
      successMessage: successMessage,
      showError: false,
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.timeouts.push(setTimeout(()=> this.setState({loading: false}), 500));
  }


  componentWillUnmount() {
    if (this.serverRequest)
      this.serverRequest.abort();
    if (this.timeouts) {
      this.timeouts.forEach(clearTimeout);
    }
  }

  handleChange(event, x) {
    const field = event.target.name;
    const value = event.target.type === 'checkbox' ?
      x :
      event.target.value;

    // update() is provided by React Immutability Helpers
    // https://facebook.github.io/react/docs/udpate.html
    let newState = update(this.state, {
      edi: {
        [field]: { $set: value }
      }
    });

    this.setState(newState);
  }

  handleSubmit(event) {
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
      url: `${API_URL}/api/edis/create`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.edi),
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
        // console.log('data in ajax response', data);
        const edi = data;
        this.setState({edi});
        this.context.router.replace(`/clients/update/${this.props.params.id}/edis`);
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
    const {edi, successMessage, errors, showError} = this.state;

    return (<ClientEdiDetailComponent
        edi={edi}
        onSubmit={this.handleSubmit}
        successMessage={successMessage}
        onChange={this.handleChange}
        errors={errors}
        showError={showError}
        actionMode={"create"}
      />);
  }
}

CreateClientEdi.contextTypes = {
  router: PropTypes.object.isRequired
};

CreateClientEdi.propTypes = {
  params: PropTypes.object.isRequired
};

export default CreateClientEdi;
