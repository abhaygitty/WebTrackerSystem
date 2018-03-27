import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import _ from 'lodash';
import $ from 'jquery';
import ClientIndexComponent from './Clients';
import ActionIconButton from '../buttons/ActionIcon';
import Auth from '../../utils/authentication';
import Helper from '../../utils/utils';
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
    key: 'name',
    label: 'Name',
    className: 'important-column',
    sortable: true,
    style: {
      width: 300,
      textAlign: "left"
    },
    tooltip: 'Name',
  }, {
    key: 'current_version',
    label: 'Version',
    sortable: false,
    style: {
      textAlign: "left",
    },
    tooltip: 'Version',
  },
  {
    key: 'locations',
    label: 'Locations',
    sortable: false,
    style: {
      textAlign: "right"
    },
    tooltip: 'Locations',
  },
  {
    key: 'action',
    label: 'Actions',
    sortable: false,
    tooltip: 'Actions',
    style: {
      width: 300,
      textAlign: 'right'
    }
  }
];

let TABLE_DATA = [];

class ClientIndex extends Component {
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

    this.timeouts = [];

    this.state = {
      errors: {},
      clientsFiltered: [],
      clientsInPage: [],
      perPage: 10,
      page: 1,
      totalPages: 1,
      loading: true,
      softwares: [],
      softwareChosen: 0,
      showInactive: false
    };
  }

  componentDidMount() {
    this.timeouts.push(setTimeout(()=> this.setState({loading: false}), 500));
    // Since fetch does not support aborting yet, we use old JQuery instead first,
    // I know there are axios and qwest could do the job, but extra library needed, that's what I dont need
    // this.resetStateAfterFetchAll();
    this.serverRequestonServiceTypes = $.ajax({
      type: "GET",
      url: `${API_URL}/api/softwares`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done(response => {
        this.setState({
          softwares: response.softwares
        });
     })
      .fail(error => {
        // console.log('ajax error after request on /api/clients/servicetypes', error);
        if( error.status === 401 && error.statusText === 'Unauthorized' ) { // Token Expired
          Auth.deauthenticateUser();
          localStorage.removeItem('token');
          this.context.router.replace('/login');
        }
      });

    this.serverRequest = $.ajax({
      type: "GET",
      url: `${API_URL}/api/clients`,
      beforeSend: (xhr) => {xhr.setRequestHeader("Authorization", Auth.getToken());}
    })
      .done((response) => {
        TABLE_DATA = response.clients.map((client) => {
          const updateDetailTo = `/clients/update/${client.client_id}`;
          // const deleteTo = `/clients/delete/${client.client_id}`;
          const updateLocationTo = `/clients/update/${client.client_id}/locations`;
          const updateContactTo = `/clients/update/${client.client_id}/contacts`;
          const updateModuleTo = `/clients/update/${client.client_id}/modules`;
          const updateJobTo = `/clients/update/${client.client_id}/jobs`;
          const updateFeeTo = `/clients/update/${client.client_id}/fees`;
          const updateRevisionTo = `/clients/update/${client.client_id}/revisions`;
          const updateRemoteInfoTo = `/clients/update/${client.client_id}/remoteinfo`;
          const updateEDITo = `/clients/update/${client.client_id}/edis`;
          return Object.assign({}, client, { action: (
            <div style={{float: "right"}}>
              <div style={{float: "right", width: "30%"}}>
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "30%"}}
                  iconType="support"
                  containerElement={<Link to={updateRemoteInfoTo} />}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "30%"}}
                  iconType="revision"
                  containerElement={<Link to={updateRevisionTo} />}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "30%"}}
                  iconType="job"
                  containerElement={<Link to={updateJobTo} />}
                />
                <div className="vertical-line" style={{height: "48px"}} />
              </div>
              <div style={{float: "right", width: "60%", paddingRight: "15px"}}>
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "15%"}}
                  iconType="edi"
                  containerElement={<Link to={updateEDITo} />}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "15%"}}
                  iconType="fee"
                  containerElement={<Link to={updateFeeTo} />}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "15%"}}
                  iconType="module"
                  containerElement={<Link to={updateModuleTo} />}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "15%"}}
                  iconType="contact"
                  containerElement={<Link to={updateContactTo} />}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "15%"}}
                  iconType="location"
                  containerElement={<Link to={updateLocationTo} />}
                />
                <ActionIconButton
                  style={{padding: "10px 10px", float: "right", width: "15%"}}
                  iconType="edit"
                  containerElement={<Link to={updateDetailTo} />}
                />
              </div>
            </div>
          )});
        });

        const clientsActive = _.filter(TABLE_DATA, (client) => {
          return !client.status;
        });
        /*
        const clientWithReviewDateDue = _.find( clientsActive, client => {
          return ( Helper.isExpired(client.reviewdate) );
        });
        // console.log('TABLE_DATA', TABLE_DATA);

        if( clientWithReviewDateDue ) {
          const notificationOpts = {
            title: 'Review date is due',
            message: `Client Name: ${clientWithReviewDateDue.name}, Review Date: ${clientWithReviewDateDue.reviewdate}`,
            position: 'tr',
            autoDismiss: 0,
            action: {
              label: 'Click to check detail!',
              callback: () => {
                alert('clicked');
                const updateDetailTo = `/clients/update/${clientWithReviewDateDue.client_id}`;
                this.context.router.replace(updateDetailTo);
              }
            }
          };
          this.props.showNotificationWithInformation(notificationOpts);
        }
        */
        const paginatedClients = Helper.getPaginatedItems(
          clientsActive,
          this.state.perPage,
          this.state.page
        );

        this.setState({
          clientsFiltered: clientsActive,
          clientsInPage: paginatedClients.data,
          totalPages: paginatedClients.totalPages
        });
      })
      .fail(error => {
        // console.log('ajax error after request on /api/clients', error);
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
    if (this.serverRequestonServiceTypes) {
      this.serverRequestonServiceTypes.abort();
    }
    if (this.timeouts) {
      this.timeouts.forEach(clearTimeout);
    }
  }

  resetGridDataWithOptions(softwareChosen, showInactive) {
    const clientsFiltered = _.filter(TABLE_DATA, (client) => {
      if (softwareChosen && client.current_software_id !== softwareChosen) {
        return false;
      }

      if (showInactive) { // inactive
        return client.status ? true : false;
      }
      else { // active
        return client.status ? false : true;
      }
    });
    // console.log('client_sorted', clients_sorted);
    const page = 1,
      perPage = this.state.perPage;
    const paginatedItems = Helper.getPaginatedItems(
      clientsFiltered,
      perPage,
      page
    );
    const clientsInPage = paginatedItems.data;
    const totalPages = paginatedItems.totalPages;
    /*const newState = Helper.assignDefined(
      {
        clientsFiltered,
        clientsInPage,
        totalPages,
        page,
      },
      this.state.softwareChosen !== softwareChosen ? { softwareChosen } : { softwareChosen: undefined },
      this.state.showInactive !== showInactive ? { showInactive } : { showInactive: undefined }
    );
    */
    const newState = Object.assign({}, this.state,
      { clientsFiltered, clientsInPage, totalPages, page},
      this.state.softwareChosen !== softwareChosen ? { softwareChosen } : { softwareChosen: 0 },
      this.state.showInactive !== showInactive ? { showInactive } : { showInactive: false }
    );

    // console.log('newState', newState);
    this.setState(newState);
  }

  handleSortOrderChange(key, order) {
    const clientsSorted = _.orderBy(this.state.clientsFiltered, key, order);
    const page = 1;
    const perPage = this.state.perPage;
    const paginatedItems = Helper.getPaginatedItems(
      clientsSorted,
      perPage,
      page
    );
    const clientsInPage = paginatedItems.data;
    const totalPages = paginatedItems.totalPages;
    this.setState({
      clientsFiltered: clientsSorted,
      clientsInPage,
      totalPages,
      page
    });
  }

  handleFilterValueChange(value) {
    const clientsFiltered = _.filter(TABLE_DATA, (client) => {
      if ( this.state.showInactive ) {
        if (!client.status) return false;
      }
      else {
        if (client.status) return false;
      }
      const regExp = new RegExp(`${value}`, 'i'); // case insensitive
      const match = regExp.test(client.name);
      return match;
    });
    // console.log('clientsFiltered', clientsFiltered);
    const page = 1,
      perPage = this.state.perPage;
    const paginatedItems = Helper.getPaginatedItems(
      clientsFiltered,
      perPage,
      page
    );
    const clientsInPage = paginatedItems.data;
    const totalPages = paginatedItems.totalPages;
    this.setState({
      clientsFiltered,
      clientsInPage,
      totalPages,
      page
    });
  }

  handleCellClick(rowIndex, columnIndex, row, column) { // eslint-disable-line no-unused-vars
    // console.log('handleCellClick rowIndex:' + rowIndex + ' columnIndex:' + columnIndex);
  }

  handleRowSelection(selectedRows) { // eslint-disable-line no-unused-vars
    // console.log('handleRowSelection selectedRows:' + selectedRows);
  }

  handlePreviousPageClick() {
    // console.log('handlePreviousPageClick');
    const page = this.state.page - 1;
    if (page <= this.state.totalPages && page >= 1 ) {
      const { clientsFiltered, perPage } = this.state;
      const paginatedItems = Helper.getPaginatedItems(clientsFiltered, perPage, page);
      const clientsInPage = paginatedItems.data;
      this.setState({
        clientsInPage,
        page
      });
    }
  }

  handleNextPageClick() {
    // console.log('handleNextPageClick, this.state.totalPages', this.state.totalPages);
    const page = this.state.page + 1;
    if (page <= this.state.totalPages && page >= 1) {
      const { clientsFiltered, perPage } = this.state;
      const paginatedItems = Helper.getPaginatedItems(clientsFiltered, perPage, page);
      const clientsInPage = paginatedItems.data;
      this.setState({
        clientsInPage,
        page
      });
    }
  }

  handleRowSizeChange(index, value) {
    // console.log('handleRowSizeChange');
    const page = 1;
    const perPage = value;
    const { clientsFiltered } = this.state;
    const paginatedItems = Helper.getPaginatedItems(clientsFiltered, perPage, page);
    const clientsInPage = paginatedItems.data;
    this.setState({
      clientsInPage,
      perPage,
      page
    });
  }

  handleAddClick(client) { // eslint-disable-line no-unused-vars
    // console.log('handleAddClick');
  }

  handleEditClick(id) { // eslint-disable-line no-unused-vars
    // console.log(`handleEditClick${id}`);
    // this.props.changeAppMode('create');
  }

  handleDeleteClick(id) { // eslint-disable-line no-unused-vars
    // console.log(`handleDeleteClick${id}`);
  }

  handleSoftwareChange(e, i, value) {
    const showInactive = this.state.showInactive;
    // console.log('value', value);
    this.resetGridDataWithOptions(value, showInactive);
  }
  // bug of material-ui, toggled does not reflect the current value
  // https://github.com/callemall/material-ui/issues/7405
  handleToggle(e, toggled) {
    const softwareChosen = this.state.softwareChosen;
    // console.log('toggled in handleToggle', toggled);
    const showInactive = !this.state.showInactive;
    this.resetGridDataWithOptions(softwareChosen, showInactive);
  }

  render() {
    // console.log("index.client.containers.clients->render->this.state", this.state);
    const { loading, softwareChosen, softwares, showInactive, clientsInPage,page, perPage, clientsFiltered } = this.state;

    if (loading) {
      return (<div style={styles.loading}>
        <Loading type="spin" color="#00BCD4" />
      </div>);
    }

    return (<ClientIndexComponent
      softwareChosen={softwareChosen}
      softwares={softwares}
      onSoftwareChange={this.handleSoftwareChange}
      showInactive={showInactive}
      onToggle={this.handleToggle}
      tableColumns={TABLE_COLUMNS}
      clientsInPage={clientsInPage}
      page={page}
      perPage={perPage}
      count={clientsFiltered.length}
      onNextPageClick={this.handleNextPageClick}
      onPreviousPageClick={this.handlePreviousPageClick}
      onRowSelection={this.handleRowSelection}
      onRowSizeChange={this.handleRowSizeChange}
      onFilterValueChange={this.handleFilterValueChange}
      onSortOrderChange={this.handleSortOrderChange}
      onCellClick={this.handleCellClick}
    />);

    /*
    return (
        <div style={styles.component} >
          <Toolbar>
            <ToolbarGroup>
              <SelectField
                value={this.state.softwareChosen}
                onChange={this.handleSoftwareChange}
              >
                <MenuItem key={0} value={0} primaryText="All" />
                {softwareOptions}
              </SelectField>
              <ToolbarSeparator/>
              <Toggle
                label="Show Inactive Only"
                style={{margin: "16px 20px"}}
                labelPosition="right"
                defaultToggled={false}
                toggled={this.state.showInactive}
                onToggle={this.handleToggle}
              />
            </ToolbarGroup>
          </Toolbar>
          <div>
            <DataTables
              title="Clients"
              titleStyle={{fontSize: 20}}
              height={'auto'}
              selectable={false}
              showRowHover={true}
              columns={TABLE_COLUMNS}
              data={this.state.clientsInPage}
              page={this.state.page}
              onNextPageClick={this.handleNextPageClick}
              onPreviousPageClick={this.handlePreviousPageClick}
              onRowSelection={this.handleRowSelection}
              rowSize={this.state.perPage}
              onRowSizeChange={this.handleRowSizeChange}
              onFilterValueChange={this.handleFilterValueChange}
              onSortOrderChange={this.handleSortOrderChange}
              onCellClick={this.handleCellClick}
              count={this.state.clientsFiltered.length}
              showCheckboxes={false}
              showHeaderToolbar={true}
              tableStyle={styles.tableStyle}
              tableBodyStyle={styles.tableBodyStyle}
              tableWrapperStyle={styles.tableWrapperStyle}
              footerToolbarStyle={styles.footerToolbarStyle}
              toolbarIconRight={[
                <ActionIconButton
                  iconType="add"
                  containerElement={<Link to="/clients/create" />}
                />
              ]}
            />
          </div>
        </div>
    );
    */
  }
}

ClientIndex.contextTypes = {
  router: PropTypes.object.isRequired
};
/*
function mapStateToProps(state) {
  return {
    clients: state.clients
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    showNotificationWithInformation
  }, dispatch);
}
export default connect(null, mapDispatchToProps)(ClientIndex);
*/
export default ClientIndex;
