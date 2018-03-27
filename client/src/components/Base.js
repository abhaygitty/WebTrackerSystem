import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import { Link } from 'react-router';
import Auth from '../utils/authentication';
import TreeSidebar from '../containers/TreeSidebarContainer';
// https://codereviewvideos.com/blog/notifications-react-and-redux/
// import NotificationContainer from '../containers/NotificationContainer';
import Alert from 'react-s-alert';

// The children object will be passed as a prop by a router that we will configure later.
const Base = (props) => {
  const {children} = props;
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

  const notification = (
    <Alert
      stack={{limit: 3}}
      position='bottom-right'
      effect='slide'
      timeout={4000} />);

  const body = (
    Auth.isUserAuthenticated() ? (
      <div>
        <div>
          <TreeSidebar />
        </div>
        <div style={{paddingLeft: 300}}>
          <span>
            {children}
          </span>
          {notification}
        </div>
      </div>
    ) : (
      <div>
        <span>
          {children}
        </span>
        {notification}
      </div>
    )
  );

  return (
    <div>
      <div>
        {topBar}
        {body}
      </div>
    </div>
  );
};

Base.propTypes = {
  children: PropTypes.node
};

export default Base;
