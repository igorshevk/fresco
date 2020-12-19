import React from 'react';
import { Layout } from 'antd';
import Header from 'app/components/Header';
import Auth from 'services/Auth';

import './styles.less';

interface AuthLayoutProps {
  children: React.ReactNode;
}
const { Content } = Layout;

const AuthLayout: React.FC<AuthLayoutProps> = props => {
  return (
    <Layout>
      <Header isLogIn={Auth.isLogged()} />
      <Content>{props.children}</Content>
    </Layout>
  );
};
export default AuthLayout;
