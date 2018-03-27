import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ClientModuleIndexComponent from './Modules';
import Auth from '../../utils/authentication';
import $ from 'jquery';
import _ from 'lodash';
import Loading from 'react-loading';

const styles = {
  loading: {
    display: "block",
    width: "10%",
    padding: "100px 200px",
    margin: "auto",
    // border: "2px solid #FF9800",
    // backgroundColor: "#ffd699",
  },
};

/*const TABLE_COLUMNS_LEFT = [
  {
    key: 'module',
    label: 'Module Name',
    className: 'important-column',
    style: {
      width: 100,
      textAlign: "left"
    },
    tooltip: 'Module Name',
  },
];
*/
let TABLE_DATA_LEFT = [];

/*
const TABLE_COLUMNS_RIGHT = [
  {
    key: 'module',
    label: 'Module Name',
    className: 'important-column',
    style: {
      width: 100,
      textAlign: "left"
    },
    tooltip: 'Module Name',
  },
];
*/

let TABLE_DATA_RIGHT = [];
let DATA_TO_ADD = [];
let DATA_TO_DEL = [];

class ClientModuleIndex extends Component {
  constructor(props) {
    super(props);

    this.handleLeftTableRowSelection = this.handleLeftTableRowSelection.bind(this);
    this.handleRightTableRowSelection = this.handleRightTableRowSelection.bind(this);
    this.handleAddingItemsClick = this.handleAddingItemsClick.bind(this);
    this.handleDeletingItemsClick = this.handleDeletingItemsClick.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.timeouts = [];

    this.state = {
      client: {},
      errors: {},
      showError: false,
      successMessage: '',
      leftItems: [],
      rightItems: [],
    };
  }

  componentDidMount() {
    this.timeouts.push(setTimeout(()=> this.setState({loading: false}), 500));
    //console.log('contacts.client.containers.clients, this.props.params.id', this.props.params);
    this.serverRequestOnClient = $.ajax({
      type: "GET",
      url: `${API_URL}/api/clients/${this.props.params.id}`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: (client) => {
        // console.log('response /clients/:id', response);
        this.setState({client});
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

    this.serverRequestOnModuleTypes = $.ajax({
      type: "GET",
      url: `${API_URL}/api/moduletypes`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: (response) => {
        TABLE_DATA_RIGHT = _.filter(response.modules, (module) => {return (module.available);});
        this.setState({rightItems: TABLE_DATA_RIGHT});
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

    this.serverRequestOnClientModule = $.ajax({
      type: "GET",
      url: `${API_URL}/api/clients/update/${this.props.params.id}/modules`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((response) => {
        // console.log('response', response);
        TABLE_DATA_LEFT = response.modules;

        this.setState({
          leftItems: TABLE_DATA_LEFT
        });
      })
      .fail(error => {
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
    if (this.serverRequestOnClient) {
      this.serverRequestOnClient.abort();
    }
    if (this.serverRequestOnClientModule) {
      this.serverRequestOnClientModule.abort();
    }
    if (this.serverRequestOnModuleTypes) {
      this.serverRequestOnModuleTypes.abort();
    }
    if (this.serverRequestOnUpdateModule) {
      this.serverRequestOnUpdateModule.abort();
    }
    if (this.timeouts) {
      this.timeouts.forEach(clearTimeout);
    }
  }

  handleLeftTableCellClick(rowIndex, columnIndex, row, column) { // eslint-disable-line no-unused-vars
    // console.log('handleCellClick rowIndex:' + rowIndex + ' columnIndex:' + columnIndex);
  }

  handleLeftTableRowSelection(selectedRows) {
    DATA_TO_DEL = selectedRows.map( (i) => {
      return({
      id: TABLE_DATA_LEFT[i].id,
      cidref: this.props.params.id,
      mid: TABLE_DATA_LEFT[i].mid,
      mdesc: TABLE_DATA_LEFT[i].mdesc
    });});
  }

  handleRightTableCellClick(rowIndex, columnIndex, row, column) { // eslint-disable-line no-unused-vars
    // console.log('handleCellClick rowIndex:' + rowIndex + ' columnIndex:' + columnIndex);
  }

  handleRightTableRowSelection(selectedRows) {
    // console.log('handleRightTableRowSelection selectedRows:' + selectedRows);
    // to merge two arrays and de-duplicate
    DATA_TO_ADD = selectedRows.map( (i) => {return({
      id: 0,
      cidref: this.props.params.id,
      mid: TABLE_DATA_RIGHT[i].module,
      mdesc: TABLE_DATA_RIGHT[i].description
    });});
  }

  handleAddingItemsClick() {
    TABLE_DATA_LEFT = _.unionBy(TABLE_DATA_LEFT, DATA_TO_ADD, "mid");
    // console.log('TABLE_DATA_LEFT', TABLE_DATA_LEFT);
    this.setState({
      leftItems: TABLE_DATA_LEFT
    });
  }

  handleDeletingItemsClick() {
    TABLE_DATA_LEFT = _.filter(TABLE_DATA_LEFT, (item) => {
      return(_.findIndex(DATA_TO_DEL, (delItem) =>{ return(item.mid == delItem.mid);}) == -1);
    });
    DATA_TO_DEL = [];
    this.setState({
      leftItems: TABLE_DATA_LEFT
    });
  }

  handleSave(event) {
    event.preventDefault();

    // this.state.errors = validator.execute(this.state, fieldValidations);
    // this.handleChange(event);
    let newState = Object.assign({}, this.state, {showError: true});
    this.setState(newState);

    if (_.isEmpty(this.state.errors) === false) { return; }
    // console.log('this.state.client', this.state.client);
    this.postNewContent();
  }

  postNewContent() {
    this.serverRequestOnUpdateModule = $.ajax({
      type: "POST",
      url: `/api/clients/${this.props.params.id}/modules/update`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(this.state.leftItems),
      beforeSend: xhr=>{xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done(data=>{
        // console.log('data in ajax response', data);
        TABLE_DATA_LEFT = data;
        this.setState({leftItems: TABLE_DATA_LEFT});
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
    const { loading, client, showError, errors, successMessage, leftItems, rightItems} = this.state;

    if (loading) {
      return (<div style={styles.loading}>
        <Loading type="spin" color="#00BCD4" />
      </div>);
    }

    return(
      <div>
        <ClientModuleIndexComponent
          client={client}
          leftTableData={leftItems}
          onLeftTableRowSelection={this.handleLeftTableRowSelection}
          rightTableData={rightItems}
          onRightTableRowSelection={this.handleRightTableRowSelection}
          onSubmit={this.handleSave}
          onAddingItemsClick={this.handleAddingItemsClick}
          onDeletingItemsClick={this.handleDeletingItemsClick}
          successMessage={successMessage}
          errors={errors}
          showError={showError}
        />
      </div>);
  }
}

ClientModuleIndex.contextTypes = {
  router: PropTypes.object.isRequired
};

ClientModuleIndex.propTypes = {
  params: PropTypes.object.isRequired
};

export default ClientModuleIndex;
