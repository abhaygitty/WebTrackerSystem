import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import ClientContactIndexComponent from './Contacts';
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
    margin: "auto",
    // border: "2px solid #FF9800",
    // backgroundColor: "#ffd699",
  },
};

const TABLE_COLUMNS = [
  {
    key: 'identity',
    label: 'Contact name',
    className: 'important-column',
    sortable: true,
    style: {
      width: 100,
      textAlign: "left"
    },
    tooltip: 'Contact Name',
  }, {
    key: 'jobdescription',
    label: 'Position/Location',
    sortable: false,
    style: {
      textAlign: "left",
    },
    tooltip: 'Position Description',
  },
  {
    key: 'phone',
    label: 'Phone',
    sortable: false,
    style: {
      textAlign: "right"
    },
    tooltip: 'Phone number',
  },
  {
    key: 'email',
    label: 'Email',
    sortable: false,
    style: {
      textAlign: "right"
    },
    tooltip: 'Email address',
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

class ClientContactIndex extends Component {
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
    //console.log('contacts.client.containers.clients, this.props.params.id', this.props.params);
    this.serverRequestOnClient = $.ajax({
      type: "GET",
      url: `${API_URL}/api/clients/${this.props.params.id}`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: (client) => {
        // console.log('response /clients/1', response);
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
      url: `${API_URL}/api/clients/update/${this.props.params.id}/contacts`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((response) => {
        // console.log('response', response);
        TABLE_DATA = response.contacts.map((contact) => {
          // const deleteTo = `/clients/delete/${this.props.params.id}/contacts/delete/${contact.contact_id}`;
          const updateTo = `/clients/update/${this.props.params.id}/contacts/update/${contact.contact_id}`;
          return Object.assign({}, contact, { action: (
            <div style={{float: "right"}}>
              <ActionIconButton
                style={{padding: "10px 10px", float: "right", width: "40%"}}
                iconType="delete"
                id={contact.contact_id}
                onClick={this.handleDeleteClick}
              />
              <ActionIconButton
                style={{padding: "10px 10px", float: "right", width: "40%"}}
                iconType="edit"
                containerElement={<Link to={updateTo} />}
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
    if (this.serverRequestOnDelete) {
      this.serverRequestOnDelete.abort();
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
    const itemsFiltered = _.filter(TABLE_DATA, (contact) => {
      const regExp = new RegExp(`${value}`, 'i'); // case insensitive
      const match = regExp.test(contact.surname);
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

  handleCellClick(rowIndex, columnIndex, row, column) { // eslint-disable-line no-unused-vars
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

  handleAddClick(client) {
    // console.log('handleAddClick');
  }

  handleEditClick(id) {
    // console.log(`handleEditClick${id}`);
    // this.props.changeAppMode('create');
  }

  handleDeleteClick(id) {
    this.setState( {
      deletingItem: _.find(TABLE_DATA, (item) => {return(item.contact_id == id);}) ,
      dialogOpen: true
    });
  }

  handleClose() {
    this.setState({deletingItem: {}, dialogOpen: false});
  }

  handleConfirmDelete() {
    const contactId = this.state.deletingItem.contact_id;
    this.serverRequestOnDelete = $.ajax({
      type: "POST",
      url: `${API_URL}/api/contacts/delete`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({contact_id: contactId}),
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());},
      success: () => {
        _.remove(TABLE_DATA, (item) => {return(item.contact_id == contactId);});
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
        Are you sure want to delete contact: {deletingItem.surname}, {deletingItem.givenname} ?
      </Dialog>);

    return(
      <div>
        <ClientContactIndexComponent
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

ClientContactIndex.contextTypes = {
  router: PropTypes.object.isRequired
};

ClientContactIndex.propTypes = {
  params: PropTypes.object.isRequired
};

export default ClientContactIndex;
