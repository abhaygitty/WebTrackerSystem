import React from 'react';
import PropTypes from 'prop-types';

// component that contains the functionalities that appear on top of
// the table: create new record
const TopActions = ({changeAppMode}) => (
  <div>
    <a href="#"
       onClick={() => changeAppMode('create')}
       className="btn btn-primary margin-bottom-1em"> Create New
    </a>
  </div>
);

TopActions.propTypes = {
  changeAppMode: PropTypes.func
};
export default TopActions;

