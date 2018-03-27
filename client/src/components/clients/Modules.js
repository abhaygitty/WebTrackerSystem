import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {Card} from 'material-ui/Card';
import ActionIconButton from '../buttons/ActionIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';

const ClientModuleIndexComponent = ({  // may use props straightaway here
  client,
  leftTableData,
  onLeftTableRowSelection,
  rightTableData,
  onRightTableRowSelection,
  onSubmit,
  onAddingItemsClick,
  onDeletingItemsClick,
  errors,
  showError,
  successMessage
}) => {
  const submit = (
      <div>
        <div className="row-action-left">
          <RaisedButton className="row-button-save" type="submit" label="Save" primary={true} />
        </div>
        <div className="row-action-right">
          <RaisedButton
            className="row-button-cancel"
            type="button"
            label="Cancel"
            primary={true}
            containerElement={<Link to="/clients" />}
          />
        </div>
      </div>);

  const leftPart = (
    <div style={{float: "left", width: "50%"}}>
      <div style={{float: "right", marginTop: "50%", marginLeft: "80px"}} >
        <ActionIconButton iconType="arrowback" type="button" onClick={onAddingItemsClick} />
        <ActionIconButton iconType="arrowforward" type="button" onClick={onDeletingItemsClick} />
      </div>
      <div style={{float: "right", width: "60%"}} >
        <Table
          height="400px"
          fixedHeader={true}
          fixedFooter={true}
          selectable={true}
          multiSelectable={true}
          onRowSelection={onLeftTableRowSelection}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn colSpan="1" style={{textAlign: 'center'}}>
                Modules Of Client: {client.name}
              </TableHeaderColumn>
            </TableRow>

          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway={false}
            showRowHover={false}
            stripedRows={false}
          >
            {leftTableData.map( (row, index) => (
              <TableRow key={index} selected={false}>
                <TableRowColumn>{row.mdesc}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter/>
        </Table>
        {submit}
      </div>
    </div>
  );

  const rightPart = (
    <div style={{float: "right", width: "40%"}} >
      <div style={{float: "left", width: "80%"}} >
        <Table
          fixedHeader={true}
          fixedFooter={true}
          selectable={true}
          multiSelectable={true}
          onRowSelection={onRightTableRowSelection}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn colSpan="1" style={{textAlign: 'center'}}>
                All Modules Available
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway={false}
            showRowHover={false}
            stripedRows={false}
          >
            {rightTableData.map( (row, index) => (
              <TableRow key={index} >
                <TableRowColumn>{row.description}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter/>
        </Table>
      </div>
    </div>
  );

  return (
    <Card>
      <form action="/" onSubmit={onSubmit} >
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.summary && showError && <p className="error-message">{errors.summary}</p>}
        {leftPart}
        {rightPart}
      </form>
    </Card>
  );
};

ClientModuleIndexComponent.propTypes = {
  client: PropTypes.object.isRequired,
  leftTableData: PropTypes.array.isRequired,
  rightTableData: PropTypes.array.isRequired,
  onLeftTableRowSelection: PropTypes.func.isRequired,
  onRightTableRowSelection: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onAddingItemsClick: PropTypes.func.isRequired,
  onDeletingItemsClick: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
};

export default ClientModuleIndexComponent;
