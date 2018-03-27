import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import NumberFormat from 'react-number-format';
import {Card} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePickerEx from '../datetimes/DatePickerEx';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
// import CheckBox from 'material-ui/Checkbox';

const ClientFeeDetailComponent = ({  // may use props straightaway here
  fee,
  feeCats,
  freqTypes,
  actionMode,
  onSubmit,
  onChange,
  onFeeCatChange,
  onFreqTypeChange,
  onBlur,
  errors,
  showError,
  successMessage
}) => {
  const styles = {
    container: {
      marginLeft: "10px",
      display: "flex",
      alignItems: "right"
    }
  };
  const startDateInput = (
    <TableRow>
      <TableRowColumn>Start Date</TableRowColumn>
      <TableRowColumn>
        <DatePickerEx
          name="fromdate"
          errorText={showError ? errors.fromdate : null}
          value={fee.fromdate}
          onBlur={onBlur}
          onChange={onChange}
          autoOk={true}
        />
      </TableRowColumn>
    </TableRow>
  );

  const feeInput = (
    <TableRow>
      <TableRowColumn>Fee</TableRowColumn>
      <TableRowColumn>
        <NumberFormat
          name="annualfee"
          customInput={TextField}
          errorText={showError ? errors.annualfee : null}
          value={fee.annualfee}
          thousandSeparator={false}
          onChange={onChange}
        />
      </TableRowColumn>
    </TableRow>
  );

  const feeCategoryItems = feeCats.map(item => {
    return (
      <MenuItem key={item.id} value={item.id} primaryText={item.description} />
    );
  });

  const feeCategoryOptions = (
    <TableRow>
      <TableRowColumn>Category</TableRowColumn>
      <TableRowColumn>
        <SelectField
          name="feecategories_id"
          value={fee.feecategories_id}
          onChange={onFeeCatChange}
          errorText={showError ? errors.feecategories_id : null}
        >
          {feeCategoryItems}
        </SelectField>
      </TableRowColumn>
    </TableRow>
  );

  const freqTypeItems = freqTypes.map(item => {
    return (
      <MenuItem key={item.id} value={item.id} primaryText={item.description} />
    );
  });

  const freqTypeOptions = (
    <TableRow>
      <TableRowColumn>Frequency</TableRowColumn>
      <TableRowColumn>
        <SelectField
          name="freqtype"
          value={fee.freqtype}
          onChange={onFreqTypeChange}
          errorText={showError ? errors.freqtype : null}
        >
          {freqTypeItems}
        </SelectField>
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
          value={fee.reviewdate}
          onBlur={onBlur}
          autoOk={true}
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
              errorText={showError ? errors.notes : null}
              value={fee.notes}
              onChange={onChange}
              multiLine={true}
              rows={2}
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
            containerElement={<Link to={`/clients/update/${fee.cidref}/fees`} />}
          />
        </div>
      </TableRowColumn>
    </TableRow>
  );

  return (
    <Card className="container">
      <form action="/" onSubmit={onSubmit} >
        <h2 className="card-heading">{actionMode == "create"? "Create Client Fee":"Modify Client Fee"}</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.summary && <p className="error-message">{errors.summary}</p>}
        <Table
          className="table table-bordered table-hover"
          selectable={false}
        >
          <TableBody
            displayRowCheckbox={false}
          >
            {startDateInput}
            {feeInput}
            {feeCategoryOptions}
            {freqTypeOptions}
            {notes}
            {reviewDate}
            {submit}
          </TableBody>
        </Table>
      </form>
    </Card>);
};

ClientFeeDetailComponent.propTypes = {
  fee: PropTypes.object,
  feeCats: PropTypes.array.isRequired,
  freqTypes: PropTypes.array.isRequired,
  actionMode: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFeeCatChange: PropTypes.func.isRequired,
  onFreqTypeChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
};

export default ClientFeeDetailComponent;
