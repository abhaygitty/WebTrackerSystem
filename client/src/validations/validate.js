export const clientFeeValidate = values => {
  const errors = {};
  if (!values.fromdate) {
    errors.fromdate = 'Required';
  }

  if(!values.annualfee) {
    errors.annnualfee = 'Required';
  } else if ( isNaN(Number(values.annualfee))) {
    errors.age = 'Must be a number';
  }

  if(!values.feecategories_id) {
    errors.feecategories_id = 'Required';
  }

  if(!values.freqtype) {
    errors.freqtype = 'Required';
  }

  if(!values.reviewdate) {
    errors.reviewdate = 'Required';
  }

  if(!values.notes) {
    errors.notes = 'Required';
  }
};
