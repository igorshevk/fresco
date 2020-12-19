import React from 'react';
import { Layout } from 'antd';
import Header from 'app/components/Header';
import Auth from 'services/Auth';

import './styles.less';

interface GuestLayoutProps {}

const GuestLayout: React.FC<GuestLayoutProps> = props => {
  return (
    <Layout>
      <Header isLogIn={Auth.isLogged()} />
      {props.children}
    </Layout>
  );
};
export default GuestLayout;
