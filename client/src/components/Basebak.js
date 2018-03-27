import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import { Link } from 'react-router';
import Auth from '../utils/authentication';
import TreeSidebar from '../containers/TreeSidebarContainer';

// The children object will be passed as a prop by a router that we will configure later.
const Base = ({ children }) => {
  // console.log('children', children);
  const topBar = (
    <AppBar
      style={{marginTop: 10}}
      title={<Link to="/"><FlatButton label="Web Tracker"/></Link>}
      iconElementLeft={
        <Link to="/">
          <IconButton>
            <ActionHome />
          </IconButton>
        </Link>
      }
      iconElementRight={
        Auth.isUserAuthenticated()
          ? ( <div><Link to="/logout"><FlatButton label="Log out"/></Link></div> )
          : ( <div>
            <Link to="/login"><FlatButton label="Log in"/></Link>
            <Link to="/signup"><FlatButton label="Sign up"/></Link>
          </div>)
      }
    />
  );

  const body = (
    Auth.isUserAuthenticated()
      ? (<div>
          <div>
            <TreeSidebar />
          </div>
          <div style={{paddingLeft: 300}}>
            {children}
          </div>
        </div>
      )
      : (<div> {children} </div>)
  );

  return (
    <div>
      {topBar}
      {body}
    </div>
  );
};

Base.propTypes = {
  children: PropTypes.node
};

export default Base;
