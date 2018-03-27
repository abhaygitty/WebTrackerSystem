import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import NumberFormat from 'react-number-format';
import MenuItem from 'material-ui/MenuItem';
import {Card} from 'material-ui/Card';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

const ClientLocationDetailComponent = ({  // may use props straightaway here
  location,
  locationTypes,
  onSelectFieldChange,
  onSubmit,
  onChange,
  errors,
  showError,
  successMessage,
  actionMode
}) => {

  const styles = {
    container: {
      marginLeft: "10px",
      display: "flex",
      alignItems: "right"
    }
  };
  const locationTypeOptions = locationTypes.map(locationType => {
    return (
      <MenuItem key={locationType.addtype} value={locationType.addtype} primaryText={locationType.description} />
    );
  });
  const locationType = (
    <TableRow>
      <TableRowColumn style={{width: "30%"}} >Location Type</TableRowColumn>
      <TableRowColumn style={{width: "70%"}} >
        <div className="row-action-left" style={{width: "100%"}} >
          <SelectField
            hintText="Select location type"
            value={location.typeref}
            onChange={onSelectFieldChange}
          >
            {locationTypeOptions}
          </SelectField>
        </div>
      </TableRowColumn>
    </TableRow>
  );

  const numberOfUnits = (
    <TableRow>
      <TableRowColumn>Number of Units</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="number_of_units"
          fullWidth
          hintText="Number of units"
          customInput={TextField}
          errorText={showError ? errors.number_of_units : null}
          value={location.number_of_units}
          thousandSeparator={false}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const description = (
    <TableRow>
      <TableRowColumn>Description</TableRowColumn>
      <TableRowColumn>
        <TextField
          type="text"
          fullWidth
          name="title"
          hintText="Description"
          errorText={showError ? errors.title : null}
          value={location.title}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const address = (
    <TableRow>
      <TableRowColumn>Address</TableRowColumn>
      <TableRowColumn>
        <div>
          <div>
            <TextField
              type="text"
              name="address1"
              fullWidth={true}
              hintText="Address line 1"
              errorText={showError ? errors.address1 : null}
              value={location.address1}
              onChange={onChange}
            />
          </div>
          <div>
            <TextField
              type="text"
              name="address2"
              fullWidth={true}
              hintText="Address line 2"
              errorText={showError ? errors.address2 : null}
              value={location.address2}
              onChange={onChange}
            />
          </div>
          <div>
            <TextField
              style={{width: "40%"}}
              type="text"
              name="suburb"
              hintText="Suburb"
              errorText={showError ? errors.suburb : null}
              value={location.suburb}
              onChange={onChange}
            />
            <TextField
              style={{width: "30%"}}
              type="text"
              name="state"
              hintText="State"
              errorText={showError ? errors.state : null}
              value={location.state}
              onChange={onChange}
            />
            <TextField
              style={{width: "30%"}}
              type="text"
              name="postcode"
              hintText="Postcode"
              errorText={showError ? errors.postcode : null}
              value={location.postcode}
              onChange={onChange}
            />
          </div>
        </div>
      </TableRowColumn>
    </TableRow>
  );

  const notes = (
    <TableRow>
      <TableRowColumn>Notes</TableRowColumn>
      <TableRowColumn>
        <Card>
          <div style={styles.container} >
            <TextField
              type="text"
              name="notes"
              fullWidth
              errorText={showError ? errors.notes : null}
              value={location.notes}
              onChange={onChange}
              multiLine={true}
              rows={3}
            />
          </div>
        </Card>
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
            containerElement={<Link to={`/clients/update/${location.cidref}/locations`} />}
          />
        </div>
      </TableRowColumn>
    </TableRow>
  );

  return (
    <Card className="container">
      <form action="/" onSubmit={onSubmit} >
        <h2 className="card-heading">{actionMode == "create"? "Create Client Location":"Modify Client Location"}</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.summary && <p className="error-message">{errors.summary}</p>}
        <Table
          className="table table-bordered table-hover"
          selectable={false}
        >
          <TableBody
            displayRowCheckbox={false}
          >
            {locationType}
            {numberOfUnits}
            {description}
            {address}
            {notes}
            {submit}
          </TableBody>
        </Table>
      </form>
    </Card>);
};

ClientLocationDetailComponent.propTypes = {
  location: PropTypes.object.isRequired,
  locationTypes: PropTypes.array.isRequired,
  onSelectFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  actionMode: PropTypes.string.isRequired
};

export default ClientLocationDetailComponent;
