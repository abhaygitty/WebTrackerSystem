import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import NumberFormat from 'react-number-format';
import { Card, CardActions } from 'material-ui/Card';
import CheckBox from 'material-ui/Checkbox';
import DatePickerEx from '../datetimes/DatePickerEx';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

const ClientComponent = ({  // may use props straightaway here
  onSubmit,
  onChange,
  onBlur,
  errors,
  showError,
  successMessage,
  client,
  actionMode
}) => {

  const styles = {
    container: {
      marginLeft: "10px",
      display: "flex",
      alignItems: "right"
    }
  };
  const name = (
    <TableRow>
      <TableRowColumn style={{width: "30%"}} >Name</TableRowColumn>
      <TableRowColumn style={{width: "70%"}} >
        <div className="row-action-left" style={{width: "70%"}} >
          <TextField
            type="text"
            name="name"
            errorText={showError ? errors.name : null}
            value={client.name}
            onChange={onChange}
          />
        </div>
        <div className="row-action-right" style={{width: "30%"}} >
          <CheckBox
            style={{margin: "10px"}}
            label="Inactive"
            name="status"
            checked={client.status?true:false}
            onCheck={onChange}
          />
        </div>
      </TableRowColumn>
    </TableRow>
  );
  const expiryDate = (
    <TableRow>
      <TableRowColumn>Contract Expiry Date</TableRowColumn>
      <TableRowColumn>
        <DatePickerEx
          name="contract_expires"
          errorText={showError ? errors.contract_expires : null}
          value={client.contract_expires}
          onChange={onChange}
          onBlur={onBlur}
          autoOk={true}
        />
      </TableRowColumn>
    </TableRow>
  );
  const prepaidMinutes = (
    <TableRow>
      <TableRowColumn>Annual Prepaid Minutes</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="prepaidminutes"
          customInput={TextField}
          errorText={showError ? errors.prepaidminutes : null}
          value={client.prepaidminutes}
          thousandSeparator={false}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const rollover = (
    <TableRow>
      <TableRowColumn>Last Allocation Rollover</TableRowColumn>
      <TableRowColumn>
        <DatePickerEx
          name="last_allocation_rollover"
          errorText={showError ? errors.last_allocation_rollover : null}
          value={client.last_allocation_rollover}
          onChange={onChange}
          onBlur={onBlur}
          autoOk={true}
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
          errorText={showError ? errors.email : null}
          value={client.email}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const initFee = (
    <TableRow>
      <TableRowColumn>Implementation Fee</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="implementation_fee"
          customInput={TextField}
          errorText={showError ? errors.implementation_fee : null}
          value={client.implementation_fee}
          thousandSeparator={true}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const reviewDate = (
    <TableRow>
      <TableRowColumn>Annual Review Date</TableRowColumn>
      <TableRowColumn>
        <DatePickerEx
          name="reviewdate"
          errorText={showError ? errors.reviewdate : null}
          value={client.reviewdate}
          onChange={onChange}
          onBlur={onBlur}
          autoOk={true}
        />
      </TableRowColumn>
    </TableRow>
  );

  const reminderMessage = (
    <TableRow>
      <TableRowColumn>Reminder Message</TableRowColumn>
      <TableRowColumn>
        <Card>
          <div style={Object.assign({}, styles.container, {paddingTop: "10px"})} >
            <CheckBox
              label="Message Read"
              name="viewed"
              checked={client.viewed?true:false}
              onCheck={onChange}
            />
          </div>
          <div style={styles.container} >
            <TextField
              type="text"
              name="reminder_message"
              floatingLabelText="Reminder Message"
              errorText={showError ? errors.reminder_message : null}
              value={client.reminder_message}
              onChange={onChange}
              multiLine={true}
              rows={2}
            />
          </div>
          <CardActions>
            <DatePickerEx
              name="reminddate"
              floatingLabelText="Reminding on"
              errorText={showError ? errors.reminddate : null}
              value={client.reminddate}
              onChange={onChange}
              onBlur={onBlur}
              autoOk={true}
            />
          </CardActions>
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
            containerElement={<Link to="/clients" />}
          />
        </div>
      </TableRowColumn>
    </TableRow>
  );

  return (
    <Card className="container">
      <form action="/" onSubmit={onSubmit} >
        <h2 className="card-heading">{actionMode == "create"? "Create Client":"Modify Client"}</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.summary && <p className="error-message">{errors.summary}</p>}
        <Table
          className="table table-bordered table-hover"
          selectable={false}
        >
          <TableBody
            displayRowCheckbox={false}
          >
            {name}
            {expiryDate}
            {prepaidMinutes}
            {rollover}
            {email}
            {initFee}
            {reviewDate}
            {reminderMessage}
            {submit}
          </TableBody>
        </Table>
      </form>
    </Card>);
};

ClientComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
  actionMode: PropTypes.string.isRequired
};

export default ClientComponent;
