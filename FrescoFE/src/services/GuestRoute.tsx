import React from 'react';
import { Route } from 'react-router-dom';
import GuestLayout from 'app/layouts/GuestLayout';

export const GuestRoute = ({ component: Component, ...rest }) => {
  return (
    <GuestLayout>
      <Route {...rest} render={props => <Component {...props} />} />
    </GuestLayout>
  );
};
