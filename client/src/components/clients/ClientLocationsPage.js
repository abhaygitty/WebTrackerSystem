import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ClientLocationIndexComponent from './Locations';
import ActionIconButton from '../buttons/ActionIcon';
import Auth from '../../utils/authentication';
import Helper from '../../utils/utils';
import $ from 'jquery';
import _ from 'lodash';
import Loading from 'react-loading';

const styles = {
  loading: {
    display: "block",
    width: "10%",
    padding: "100px 200px",
    margin: "auto"
  },
};

const TABLE_COLUMNS = [
  {
    key: 'addresstype',
    label: 'Type',
    className: 'important-column',
    sortable: true,
    style: {
      width: 100,
      textAlign: "left"
    },
    tooltip: 'Location Type',
  }, {
    key: 'title',
    label: 'Description',
    sortable: false,
    style: {
      textAlign: "left",
    },
    tooltip: 'Location Description',
  },
  {
    key: 'number_of_units',
    label: 'Number Of Units',
    sortable: false,
    style: {
      textAlign: "right"
    },
    tooltip: 'Number of Beds/ILUs/CCs/Others',
  },
  {
    key: 'action',
    label: 'Actions',
    sortable: false,
    tooltip: 'Actions',
    style: {
      width: 100,
      textAlign: 'right'
    }
  }
];

let TABLE_DATA = [];

class ClientLocationIndex extends Component {
  constructor(props) {
    super(props);

    this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
    this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);

    /* deprecated  */
    /* It is inadvisable to bind handlers to both the click and dblclick events for the same element.
     The sequence of events triggered varies from browser to browser, with some receiving two click
     events before the dblclick and others only one. Double-click sensitivity (maximum time between
     clicks that is detected as a double click) can vary by operating system and browser, and is
     often user-configurable.
     Ref: https://api.jquery.com/dblclick/
     */
    /* this.handleCellDoubleClick = this.handleCellDoubleClick.bind(this); */ /* deprecated  */
    this.handleRowSizeChange = this.handleRowSizeChange.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    // this.handleInfoClick = this.handleInfoClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleSoftwareChange = this.handleSoftwareChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);

    this.timeouts = [];

    this.state = {
      client: {},
      errors: {},
      itemsFiltered: [],
      itemsInPage: [],
      perPage: 10,
      page: 1,
      totalPages: 1,
      dialogOpen: false,
      deletingItem: {}
    };
  }

  componentDidMount() {
    this.timeouts.push(setTimeout(()=> this.setState({loading: false}), 500));
    //console.log('locations.client.containers.clients, this.props.params.id', this.props.params);
    this.serverRequestOnClient = $.ajax({
      type: "GET",
      url: `${API_URL}/api/clients/${this.props.params.id}`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: (data) => {
        // console.log('response /clients/1', response);
        const client = data;
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

    this.serverRequest = $.ajax({
      type: "GET",
      url: `${API_URL}/api/clients/update/${this.props.params.id}/locations`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((data) => {
      // console.log('response.locations', response.locations);
        TABLE_DATA = data.locations.map((location) => {
          // const deleteLocationTo = `/clients/delete/${this.props.params.id}/locations/delete/${location.address_id}`;
          const updateLocationTo = `/clients/update/${this.props.params.id}/locations/update/${location.address_id}`;
          return Object.assign({}, location, { action: (
            <div style={{float: "right"}}>
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "40%"}}
                  iconType="delete"
                  id={location.address_id}
                  onClick={this.handleDeleteClick}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "40%"}}
                  iconType="edit"
                  containerElement={<Link to={updateLocationTo} />}
                />
            </div>
          )});
        });

        const paginatedItems = Helper.getPaginatedItems(
          TABLE_DATA,
          this.state.perPage,
          this.state.page
        );

        this.setState({
          itemsFiltered: TABLE_DATA,
          itemsInPage: paginatedItems.data,
          totalPages: paginatedItems.totalPages
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
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
    if (this.serverRequestOnClient) {
      this.serverRequestOnClient.abort();
    }
    if (this.serverRequestOnDeleteLocation) {
      this.serverRequestOnDeleteLocation.abort();
    }
    if (this.timeouts) {
      this.timeouts.forEach(clearTimeout);
    }
  }

  handleSortOrderChange(key, order) {
    // console.log('key:' + key + ' order: ' + order);
    const itemsSorted = _.orderBy(this.state.itemsFiltered, key, order);
    const page = 1;
    const perPage = this.state.perPage;
    const paginatedItems = Helper.getPaginatedItems(
      itemsSorted,
      perPage,
      page
    );
    const itemsInPage = paginatedItems.data;
    const totalPages = paginatedItems.totalPages;
    this.setState({
      itemsFiltered: itemsSorted,
      itemsInPage,
      totalPages,
      page
    });
  }

  handleFilterValueChange(value) {
    const itemsFiltered = _.filter(TABLE_DATA, (location) => {
      const regExp = new RegExp(`${value}`, 'i'); // case insensitive
      const match = regExp.test(location.title);
      return match;
    });
    // console.log('clientsFiltered', clientsFiltered);
    const page = 1,
      perPage = this.state.perPage;
    const paginatedItems = Helper.getPaginatedItems(
      itemsFiltered,
      perPage,
      page
    );
    const itemsInPage = paginatedItems.data;
    const totalPages = paginatedItems.totalPages;
    this.setState({
      itemsFiltered,
      itemsInPage,
      totalPages,
      page
    });
  }

  handleCellClick(rowIndex, columnIndex, row, column) {
    // console.log('handleCellClick rowIndex:' + rowIndex + ' columnIndex:' + columnIndex);
  }

  // handleCellDoubleClick(rowIndex, columnIndex, row, column) {
  //  console.log('handleCellDoubleClick rowIndex:' + rowIndex + ' columnIndex:' + columnIndex);
  // }

  handleRowSelection(selectedRows) {
    // console.log('handleRowSelection selectedRows:' + selectedRows);
  }

  handlePreviousPageClick() {
    // console.log('handlePreviousPageClick');
    const page = this.state.page - 1;
    if (page <= this.state.totalPages && page >= 1 ) {
      const { itemsFiltered, perPage } = this.state;
      const paginatedItems = Helper.getPaginatedItems(itemsFiltered, perPage, page);
      const itemsInPage = paginatedItems.data;
      this.setState({
        itemsInPage,
        page
      });
    }
  }

  handleNextPageClick() {
    // console.log('handleNextPageClick, this.state.totalPages', this.state.totalPages);
    const page = this.state.page + 1;
    if (page <= this.state.totalPages && page >= 1) {
      const { itemsFiltered, perPage } = this.state;
      const paginatedItems = Helper.getPaginatedItems(itemsFiltered, perPage, page);
      const itemsInPage = paginatedItems.data;
      this.setState({
        itemsInPage,
        page
      });
    }
  }

  handleRowSizeChange(index, value) {
    // console.log('handleRowSizeChange');
    const page = 1;
    const perPage = value;
    const { itemsFiltered } = this.state;
    const paginatedItems = Helper.getPaginatedItems(itemsFiltered, perPage, page);
    const itemsInPage = paginatedItems.data;
    this.setState({
      itemsInPage,
      perPage,
      page
    });
  }

  handleAddClick() {
    // console.log('handleAddClick');
  }

  handleEditClick(id) {
    // console.log(`handleEditClick${id}`);
    // this.props.changeAppMode('create');
  }

  handleDeleteClick(id) {
    this.setState( {
      deletingItem: _.find(TABLE_DATA, (item) => {return(item.address_id == id);}) ,
      dialogOpen: true
    });
  }

  handleSoftwareChange(e, i, value) {
    const showInactive = this.state.showInactive;
    this.resetGridDataWithOptions(value, showInactive);
  }

  handleToggle(e, toggled) {
    const softwareChosen = this.state.softwareChosen;
    this.resetGridDataWithOptions(softwareChosen, toggled);
  }

  handleClose() {
    this.setState({deletingItem: {}, dialogOpen: false});
  }

  handleConfirmDelete() {
    const locationId = this.state.deletingItem.address_id;
    this.serverRequestOnDeleteLocation = $.ajax({
      type: "POST",
      url: `${API_URL}/api/locations/delete`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({address_id: locationId}),
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: () => {
        // console.log('response /locations/delete/1', response);
        _.remove(TABLE_DATA, (item) => {return(item.address_id == locationId);});
        const paginatedItems = Helper.getPaginatedItems(
          TABLE_DATA,
          this.state.perPage,
          this.state.page
        );

        this.setState({
          itemsFiltered: TABLE_DATA,
          itemsInPage: paginatedItems.data,
          totalPages: paginatedItems.totalPages,
          deletingItem: {},
          dialogOpen: false
        });
      },
      failure: (error) => {
        let errorsSet = error ? error : {};
        errorsSet.summary = error.message;

        this.setState({
          errors: errorsSet,
          deletingItem: {},
          dialogOpen: false
        });

        Helper.ajaxHandler(error, this.context.router, '/login');
      }
    });
  }

  render() {
    const { loading, client, itemsInPage, page, perPage, itemsFiltered, dialogOpen, deletingItem } = this.state;

    if (loading) {
      return (<div style={styles.loading}>
        <Loading type="spin" color="#00BCD4" />
      </div>);
    }

    const actions = [
      <FlatButton
        key="cancel"
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        key="delete"
        label="Delete"
        primary={true}
        onTouchTap={this.handleConfirmDelete}
      />,
    ];

    const deleteDialog = (
      <Dialog
        actions={actions}
        modal={false}
        open={dialogOpen}
        onRequestClose={this.handleClose}
      >
        Are you sure want to delete location: {deletingItem.title}?
      </Dialog>);

    return(
      <div>
        <ClientLocationIndexComponent
          client={client}
          tableColumns={TABLE_COLUMNS}
          itemsInPage={itemsInPage}
          page={page}
          perPage={perPage}
          count={itemsFiltered.length}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
          onRowSelection={this.handleRowSelection}
          onRowSizeChange={this.handleRowSizeChange}
          onFilterValueChange={this.handleFilterValueChange}
          onSortOrderChange={this.handleSortOrderChange}
          onCellClick={this.handleCellClick}
        />
        {deleteDialog}
      </div>);
  }
}

ClientLocationIndex.contextTypes = {
  router: PropTypes.object.isRequired
};

ClientLocationIndex.propTypes = {
  params: PropTypes.object.isRequired
};

export default ClientLocationIndex;
