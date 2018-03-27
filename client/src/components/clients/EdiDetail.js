import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import NumberFormat from 'react-number-format';
import { Card } from 'material-ui/Card';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
// import CheckBox from 'material-ui/Checkbox';

const ClientEdiDetailComponent = ({  // may use props straightaway here
  edi,
  actionMode,
  onSubmit,
  onChange,
  errors,
  showError,
  successMessage
}) => {

  const serviceName = (
    <TableRow>
      <TableRowColumn>Name of Service</TableRowColumn>
      <TableRowColumn>
        <TextField
          type="text"
          name="service"
          fullWidth
          errorText={showError ? errors.serivce : null}
          value={edi.service}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const racsId = (
    <TableRow>
      <TableRowColumn>RACS ID</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="edinumber"
          customInput={TextField}
          errorText={showError ? errors.edinumber : null}
          value={edi.edinumber}
          thousandSeparator={false}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const ediString = (
    <TableRow>
      <TableRowColumn>EDI String</TableRowColumn>
      <TableRowColumn>
        <TextField
          type="text"
          name="edistring"
          errorText={showError ? errors.edistring : null}
          value={edi.edistring}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const submit = (
    <TableRow>
      <TableRowColumn/>
      <TableRowColumn>
        <div className="row-action-left">
          <RaisedButton className="row-button-save" type="submit" label="Save" primary={true} />
        </div>
        <div className="row-action-right">
          <RaisedButton
            className="row-button-cancel"
            type="button"
            label="Cancel"
            primary={true}
            containerElement={<Link to={`/clients/update/${edi.cidref}/edis`} />}
          />
        </div>
      </TableRowColumn>
    </TableRow>
  );

  return (
    <Card className="container">
      <form action="/" onSubmit={onSubmit} >
        <h2 className="card-heading">{actionMode == "create"? "Create Client EDI":"Modify Client EDI"}</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.summary && <p className="error-message">{errors.summary}</p>}
        <Table
          className="table table-bordered table-hover"
          selectable={false}
        >
          <TableBody
            displayRowCheckbox={false}
          >
            {serviceName}
            {racsId}
            {ediString}
            {submit}
          </TableBody>
        </Table>
      </form>
    </Card>);
};

ClientEdiDetailComponent.propTypes = {
  edi: PropTypes.object,
  actionMode: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
};

export default ClientEdiDetailComponent;
