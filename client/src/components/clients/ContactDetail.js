import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import NumberFormat from 'react-number-format';
import TextField from 'material-ui/TextField';
import CheckBox from 'material-ui/Checkbox';
import {Card} from 'material-ui/Card';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

const ClientContactDetailComponent = ({  // may use props straightaway here
  contact,
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

  const salutation = (
    <TableRow>
      <TableRowColumn>Salutation</TableRowColumn>
      <TableRowColumn>
        <div>
          <TextField
            style={{width: "60%"}}
            type="text"
            name="salutation"
            fullWidth
            hintText="salutation"
            errorText={showError ? errors.salutation : null}
            value={contact.salutation}
            onChange={onChange}
          />
        </div>
        <div style={{paddingTop: "10px"}} >
          <CheckBox
            label="Primary Contact"
            name="primarycontact"
            checked={contact.primarycontact?true:false}
            onCheck={onChange}
          />
        </div>
      </TableRowColumn>
    </TableRow>
  );

  const surname = (
    <TableRow>
      <TableRowColumn>Surname</TableRowColumn>
      <TableRowColumn>
        <TextField
          type="text"
          fullWidth
          name="surname"
          hintText="Surname"
          errorText={showError ? errors.surname : null}
          value={contact.surname}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const givenName = (
    <TableRow>
      <TableRowColumn>Given Name</TableRowColumn>
      <TableRowColumn>
          <TextField
            type="text"
            name="givenname"
            fullWidth={true}
            hintText="Given Name"
            errorText={showError ? errors.givenname : null}
            value={contact.givenname}
            onChange={onChange}
          />
      </TableRowColumn>
    </TableRow>
  );

  const jobDescription = (
    <TableRow>
      <TableRowColumn>Position/Location</TableRowColumn>
      <TableRowColumn>
        <TextField
          type="text"
          name="jobdescription"
          fullWidth={true}
          hintText="Position/Location"
          errorText={showError ? errors.jobdescription : null}
          value={contact.jobdescription}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const phone = (
    <TableRow>
      <TableRowColumn>Telephone Number</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="phone"
          customInput={TextField}
          fullWidth={true}
          hintText="Telepohone Number"
          errorText={showError ? errors.phone : null}
          thousandSeparator={false}
          value={contact.phone}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const fax = (
    <TableRow>
      <TableRowColumn>Fax</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="fax"
          customInput={TextField}
          fullWidth={true}
          hintText="Fax"
          errorText={showError ? errors.fax : null}
          thousandSeparator={false}
          value={contact.fax}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const mobile = (
    <TableRow>
      <TableRowColumn>Mobile Number</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="mobile"
          customInput={TextField}
          fullWidth={true}
          hintText="Mobile"
          errorText={showError ? errors.mobile : null}
          thousandSeparator={false}
          value={contact.mobile}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const email = (
    <TableRow>
      <TableRowColumn>Email</TableRowColumn>
      <TableRowColumn>
        <TextField
          type="text"
          name="email"
          fullWidth={true}
          hintText="Email"
          errorText={showError ? errors.email : null}
          value={contact.email}
          onChange={onChange}
        />
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
              value={contact.notes}
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
            containerElement={<Link to={`/clients/update/${contact.cid}/contacts`} />}
          />
        </div>
      </TableRowColumn>
    </TableRow>
  );

  return (
    <Card className="container">
      <form action="/" onSubmit={onSubmit} >
        <h2 className="card-heading">{actionMode == "create"? "Create Client Contact":"Modify Client Contact"}</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.summary && <p className="error-message">{errors.summary}</p>}
        <Table
          className="table table-bordered table-hover"
          selectable={false}
        >
          <TableBody
            displayRowCheckbox={false}
          >
            {salutation}
            {surname}
            {givenName}
            {jobDescription}
            {phone}
            {fax}
            {mobile}
            {email}
            {notes}
            {submit}
          </TableBody>
        </Table>
      </form>
    </Card>);
};

ClientContactDetailComponent.propTypes = {
  contact: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  actionMode: PropTypes.string.isRequired
};

export default ClientContactDetailComponent;
