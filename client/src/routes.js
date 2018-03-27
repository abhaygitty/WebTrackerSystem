/**
 * Created by Patrick on 12/03/2017.
 */
import React from 'react';
import Base from './components/Base';
import ToDoPage from './components/ToDo';
import HomePage from './components/HomePage';
import LoginPage from './components/authentication/LoginFormPage';
import ForgotPasswordFormPage from './components/authentication/ForgotPasswordFormPage';
import ResetPasswordFormPage from './components/authentication/ResetPasswordFormPage';
import SignUpPage from './components/authentication/SignupFormPage';
import Auth from './utils/authentication';
import ClientIndex from './components/clients/ClientsPage';
import UpdateClient from './components/clients/UpdateClientPage';
import CreateClient from './components/clients/CreateClientPage';
import ClientLocationIndex from './components/clients/ClientLocationsPage';
import CreateClientLocation from './components/clients/CreateLocationPage';
import UpdateClientLocation from './components/clients/UpdateClientLocationPage';
import ClientContactIndex from './components/clients/ClientContactsPage';
import CreateClientContact from './components/clients/CreateContactPage';
import UpdateClientContact from './components/clients/UpdateClientContactPage';
import ClientModuleIndex from './components/clients/ClientModulesPage';
import ClientFeeIndex from './components/clients/FeesPage';
import CreateClientFee from './components/clients/CreateFeePage';
import UpdateClientFee from './components/clients/UpdateClientFeePage';
import ClientEdiIndex from './components/clients/EdisPage';
import CreateClientEdi from './components/clients/CreateClientEdiPage';
import UpdateClientEdi from './components/clients/UpdateClientEdiPage';

// import DeleteClientLocation from './containers/clients/deleteLocation.client.containers.clients';

const routes = {
  // base component ( wrapper for the whole application )
  component: Base,
  childRoutes: [
    {
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ClientIndex);
        } else {
          callback(null, HomePage);
        }
      },
    },
    {
      path: '/clients',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ClientIndex);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/create',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, CreateClient);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, UpdateClient);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/locations',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ClientLocationIndex); //To Do, replaced with ClientLocationIndex
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/locations/create',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, CreateClientLocation);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/locations/update/:location_id',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, UpdateClientLocation); //To Do, replaced with updateClientLocation
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/contacts',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ClientContactIndex); //To Do, replaced with ClientContactIndex
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/contacts/create',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, CreateClientContact);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/contacts/update/:contact_id',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, UpdateClientContact);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/modules',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ClientModuleIndex);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/modules/create',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ToDoPage);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/modules/update/:module_id',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ToDoPage); //To Do, replaced with updateClientLocation
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/fees',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ClientFeeIndex);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/fees/create',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, CreateClientFee);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/fees/update/:fee_id',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, UpdateClientFee);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/edis',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, ClientEdiIndex);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/edis/create',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, CreateClientEdi);
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/clients/update/:id/edis/update/:edinumber',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, UpdateClientEdi); //To Do, replaced with updateClientLocation
        } else {
          callback(null, HomePage);
        }
      }
    },
    {
      path: '/jobs',
      component: function() {return (<div>This is jobs page</div>);}
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/forgot-password',
      component: ForgotPasswordFormPage
    },
    {
      path: '/reset-password/:resetToken',
      component: ResetPasswordFormPage
    },
    {
      path: '/signup',
      component: SignUpPage
    },
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();
        localStorage.removeItem('token');
        // change the current URL to
        replace('/');
      }
    }
  ]
};

export default routes;
