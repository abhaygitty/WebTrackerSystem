import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {deepOrange500} from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ActionIconButton from '../buttons/ActionIcon';
import DataTables from '../datatables/Composition';

const ClientIndexComponent = ({  // may use props straightaway here
  softwareChosen,
  softwares,
  onSoftwareChange,
  showInactive,
  onToggle,
  tableColumns,
  clientsInPage,
  page,
  perPage,
  count,
  onNextPageClick,
  onPreviousPageClick,
  onRowSelection,
  onRowSizeChange,
  onFilterValueChange,
  onSortOrderChange,
  onCellClick
}) => {
  const styles = {
    icon: {
      opacity: 0.64,
    },
    container: {
      textAlign: 'left',
    },
    component: {
      margin: '5px 15px',
    },
    titleStyle: {
      fontSize: 16,
      color: deepOrange500,
    },
    footerToolbarStyle: {
      padding: '0 100px',
    },
    tableStyle: {
      tableLayout: 'auto',
    },
    tableBodyStyle: {
      overflow: 'auto',
    },
    tableWrapperStyle: {
      padding: 5,
    },
    rowActionIconGroup: {
      margin: "0"
    },
    rowActionIcon: {
      float: "left",
    },
    loading: {
      display: "block",
      width: "10%",
      padding: "100px 200px",
      margin: "auto",
      // border: "2px solid #FF9800",
      // backgroundColor: "#ffd699",
    },
    componentHeader: {
      position: "fixed",
      top: 0,
      left: "300px",
      right:0,
      height: "100px"
    },
    componentBody: {
      position: "fixed",
      top: "100px",
      left: "300px",
      right: 0,
      overflow: "auto"
    },
    componentLeft: {
      float: "left",
      width: "50%",
      overflow: "hidden"
    },
    componentRight: {
      float: "left",
      width: "50%",
      overflow: "hidden"
    }
  };

  const softwareOptions = softwares.map(software => {
    return (
      <MenuItem key={software.id} value={software.id} primaryText={software.code} />
    );
  });

  // console.log('showInactive', showInactive);

  return (
    <div style={styles.component} >
      <Toolbar>
        <ToolbarGroup>
          <SelectField
          value={softwareChosen}
          onChange={onSoftwareChange}
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
            toggled={showInactive}
            onToggle={onToggle}
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
          columns={tableColumns}
          data={clientsInPage}
          page={page}
          onNextPageClick={onNextPageClick}
          onPreviousPageClick={onPreviousPageClick}
          onRowSelection={onRowSelection}
          rowSize={perPage}
          onRowSizeChange={onRowSizeChange}
          onFilterValueChange={onFilterValueChange}
          onSortOrderChange={onSortOrderChange}
          onCellClick={onCellClick} /* to get the index */
          /* onCellDoubleClick={this.handleCellDoubleClick} */ /* deprecated  */
          count={count}
          showCheckboxes={false}
          showHeaderToolbar={true}
          tableStyle={styles.tableStyle}
          tableBodyStyle={styles.tableBodyStyle}
          tableWrapperStyle={styles.tableWrapperStyle}
          footerToolbarStyle={styles.footerToolbarStyle}
          toolbarIconRight={[
            <ActionIconButton
              key="add"
              iconType="add"
              containerElement={<Link to="/clients/create" />}
            />
          ]}
        />
      </div>
    </div>
  );
};

ClientIndexComponent.propTypes = {
  softwareChosen: PropTypes.number,
  softwares: PropTypes.array,
  onSoftwareChange: PropTypes.func,
  showInactive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func,
  tableColumns: PropTypes.array.isRequired,
  clientsInPage: PropTypes.array,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onNextPageClick: PropTypes.func.isRequired,
  onPreviousPageClick: PropTypes.func.isRequired,
  onRowSelection: PropTypes.func.isRequired,
  onRowSizeChange: PropTypes.func.isRequired,
  onFilterValueChange: PropTypes.func.isRequired,
  onSortOrderChange: PropTypes.func.isRequired,
  onCellClick: PropTypes.func.isRequired
};

export default ClientIndexComponent;
