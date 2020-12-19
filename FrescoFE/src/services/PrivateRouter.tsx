import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthLayout from 'app/layouts/AuthLayout';

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const authInfo = localStorage.getItem('authInformation');
  return (
    <AuthLayout>
      <Route
        {...rest}
        render={props =>
          authInfo ? <Component {...props} /> : <Redirect to="/auth/login" />
        }
      />
    </AuthLayout>
  );
};
