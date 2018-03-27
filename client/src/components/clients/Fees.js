import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {deepOrange500} from 'material-ui/styles/colors';
import ActionIconButton from '../buttons/ActionIcon';
import DataTables from '../datatables/Composition';

//{  // may use props straightaway here
//  client,
//    tableColumns,
//    itemsInPage,
//    page,
//    perPage,
//    count,
//    onNextPageClick,
//    onPreviousPageClick,
//    onRowSelection,
//    onRowSizeChange,
//    onFilterValueChange,
//    onSortOrderChange,
//    onCellClick
//}

const ClientFeeIndexComponent = ({
  client, tableColumns, itemsInPage, page, perPage,
  count, onNextPageClick, onPreviousPageClick, onRowSelection, onRowSizeChange,
  onFilterValueChange, onSortOrderChange, onCellClick
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

  // console.log('props.client', props.client);
  return (
    <div style={styles.component} >
      <div>
        <DataTables
          title={`Fees of Client: ${client.name}`}
          titleStyle={{fontSize: 20}}
          height={'auto'}
          selectable={false}
          showRowHover={true}
          columns={tableColumns}
          data={itemsInPage}
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
            (<ActionIconButton
              key="add"
              iconType="add"
              containerElement={<Link to={`/clients/update/${client.client_id}/fees/create`} />}
            />),
            (<ActionIconButton
              key="back"
              iconType="back"
              containerElement={<Link to={`/clients`} />}
            />),
          ]}
        />
      </div>
    </div>
  );
};

ClientFeeIndexComponent.propTypes = {
  client: PropTypes.object.isRequired,
  tableColumns: PropTypes.array.isRequired,
  itemsInPage: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  onNextPageClick: PropTypes.func,
  onPreviousPageClick: PropTypes.func,
  onRowSelection: PropTypes.func,
  onRowSizeChange: PropTypes.func,
  onFilterValueChange: PropTypes.func,
  onSortOrderChange: PropTypes.func,
  onCellClick: PropTypes.func
};

export default ClientFeeIndexComponent;
