/**
 *
 * WelcomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Typography, Spin } from 'antd';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectWelcomePage } from './selectors';
import { welcomePageSaga } from './saga';
import Auth from 'services/Auth';
import { selectUser } from '../../selectors';
import Axios from 'axios';

import { OrganizationsApiService } from 'services/APIService/OrganizationsApi.service';

interface Props {
  location: any;
}

const Div = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WelcomePage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: welcomePageSaga });
  const authInfo = localStorage.getItem('authInformation')
    ? JSON.parse(localStorage.getItem('authInformation') || '')
    : null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const welcomePage = useSelector(selectWelcomePage);
  const user = useSelector(selectUser);

  let token = null;
  if (authInfo && authInfo.token && authInfo.token.accessToken) {
    token = authInfo.token.accessToken;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const { Title, Text } = Typography;
  const history = useHistory();
  const queryParams = new URLSearchParams(props.location.search);
  const [userOrg, setUserOrg] = useState(false);

  useEffect(() => {
    if (token || !queryParams.get('accessToken')) return;
    dispatch(
      actions.signInRequest({ token: queryParams.get('accessToken'), history }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    OrganizationsApiService.list().subscribe(data => {
      if (data.length > 0) {
        setUserOrg(data[0].organizationName);
      }
    });
  }, [user]);

  const { loading } = welcomePage;

  if (loading) {
    return (
      <Div>
        <Spin size="large" />
      </Div>
    );
  }

  return (
    <div
      style={{
        width: '532px',
        margin: '0px auto',
      }}
    >
      <Helmet>
        <title>SignIn</title>
        <meta name="description" content="Description of SignIn" />
      </Helmet>

      <Div>
        <Card bodyStyle={{ padding: '24px 92px 68px 92px' }}>
          <Title style={{ textAlign: 'center', color: '#5D2E8C' }} level={3}>
            Welcome to Fresco
          </Title>

          <div style={{ textAlign: 'center', marginTop: 85 }}>
            <Text>
              "{userOrg ? userOrg : user?.email}" is here release the power of
              collaboration with your team
            </Text>
          </div>

          <div style={{ textAlign: 'center', marginTop: 128 }}>
            <Text>Leo, John and 56 others are using Fresco</Text>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ background: '9646f5', marginTop: 39 }}
            onClick={() => {
              history.push('/');
            }}
          >
            Let's Start
          </Button>
        </Card>
      </Div>
    </div>
  );
});
