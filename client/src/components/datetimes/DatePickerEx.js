/*
 Thanks to oshlygin @ https://github.com/callemall/material-ui/issues/6538
 https://github.com/barbalex/apf2/blob/master/src/components/shared/DateFieldWithPicker.js
 */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconCalendar from 'material-ui/svg-icons/action/date-range';
import DatePicker from 'material-ui/DatePicker';
import format from 'date-fns/format';
import Helper from '../../utils/utils';

const Styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  icon: {
    cursor: "pointer",
    pointerEvents: "auto",
    fontSize: "34px",
    marginTop: "15px"
  },

  datePicker: {
    width: "0",
    height: "0"
  }
};

class DatePickerEx extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      readyToFormat: false
    };

    this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleTextFieldBlur = this.handleTextFieldBlur.bind(this);
    this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
  }

  componentWillMount() {
    const { value } = this.props;

    this.setState({
      value,
      readyToFormat: true
    });
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.setState({
      value,
      readyToFormat: true
    });
  }

  handleTextFieldChange(event, val) {
    // console.log('handleTextFieldChange(), val', val);
    this.setState({
      value: val,
      readyToFormat: false
    });
  }

  handleTextFieldBlur(event) {
    // console.log('trigger handleTextFieldFocus');
    const inputValue = event.target.value;
    const newDateString = Helper.parseDdMmYyyyToYyyyMmDd(inputValue);
    const invalidString = ( newDateString === '' || newDateString.toUpperCase() === 'INVALID DATE' );
    const stringValue = invalidString ?
      '' :
      Helper.parseValueToAusFormat(inputValue);
    // console.log('stringValue', stringValue);
    this.setState({
        value: stringValue,
        readyToFormat: true
    });

    const { onBlur } = this.props;
    if (onBlur) {
      // console.log('trigger onBlur stringValue', stringValue);
      onBlur(event, stringValue);
    }
  }

  handleDatePickerChange(event, date) {
    // console.log('trigger handleDatePickerChange', date);
    const newValue = format(date, `DD/MM/YYYY`);
    // console.log('newValue', newValue);
    this.setState({
      value: newValue,
      readyToFormat: true
    });
    this.textField.focus();
  }

  handleTextFieldFocus(event) {
    // console.log('trigger handleTextFieldFocus');
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(event);
    }
  }

  render() {
    const {name, floatingLabelText, defaultDate, errorText, disabled} = this.props;

    const {value} = this.state;

    // value validation check
    const newDateString = Helper.parseDdMmYyyyToYyyyMmDd(value);
    const invalidString = ( newDateString === '' || newDateString.toUpperCase() === 'INVALID DATE' );
    const valueDate = invalidString ?
      ( (!defaultDate) ? new Date() : defaultDate ) :
      ( new Date(newDateString) );

    return (<div style={Object.assign({}, Styles.container)}>
      <TextField
        floatingLabelText={floatingLabelText}
        type="text"
        name={name}
        value={value}
        errorText={errorText}
        disabled={disabled}
        fullWidth
        onChange={this.handleTextFieldChange}
        onBlur={this.handleTextFieldBlur}
        onFocus={this.handleTextFieldFocus}
        ref={(tf) => { this.textField = tf; }}
      />
      <IconButton>
        <IconCalendar
          style={Object.assign({}, Styles.icon)}
          onClick={() => { this.datePicker.focus(); }}
        />
      </IconButton>
      <div>
        <DatePicker
          tabIndex={-1}
          style={Object.assign({}, Styles.datePicker)}
          id="datePicker"
          name={name}
          floatingLabelText={''}
          value={valueDate}
          defaultDate={defaultDate}
          errorText={errorText}
          disabled={disabled}
          DateTimeFormat={window.Intl.DateTimeFormat}
          locale="en-au"
          formatDate={(v) => { format(v, `DD/MM/YYYY`); }}
          container="inline"
          mode="landscape"
          autoOk
          fullWidth
          cancelLabel="Cancel"
          onChange={this.handleDatePickerChange}
          ref={(dp) => { this.datePicker = dp; }}
        />
      </div>
    </div>);
  }
}

DatePickerEx.propTypes = {
  name: PropTypes.string.isRequired,
  floatingLabelText: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  defaultDate: PropTypes.object,
  errorText: PropTypes.string,
  disabled: PropTypes.bool,
  onChangeDatePicker: PropTypes.func,
  onDismissDatePicker: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

DatePickerEx.defaultProps = {
  floatingLabelText: '',
  value: '',
  defaultDate: new Date(),
  errorText: '',
  disabled: false
};

export default DatePickerEx;
