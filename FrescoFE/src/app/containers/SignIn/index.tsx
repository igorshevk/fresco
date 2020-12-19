/**
 *
 * SignIn

 */

import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Checkbox, Card, Typography } from 'antd';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { actions as globalActions } from '../../slice';
import { selectSignIn } from './selectors';
// import { selectToken } from '../../selectors';
import { signInSaga } from './saga';

// Components
import { GoogleButton } from 'app/components/GoogleButton';

interface Props {}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Title } = Typography;

const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

export const SignIn = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: signInSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading } = useSelector(selectSignIn);
  // const token = useSelector(selectToken);
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const onFinish = values => {
    dispatch(actions.signInRequest({ data: values, history }));
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    // TODO: verify token
    const authInfo = localStorage.getItem('authInformation');
    if (authInfo) {
      dispatch(globalActions.setAuthInformation(JSON.parse(authInfo || '')));
    }
  }, [dispatch]);

  // if (token) {
  //   return <Redirect to="/" />;
  // }

  const loginGoogle = () => {
    window.location.href = `${process.env.REACT_APP_BASE_URL}auth/google`;
  };

  return (
    <div
      style={{
        width: '532px',
        boxShadow: '0 2px rgba(0,0,0, 0.1)',
        margin: '100px auto',
      }}
    >
      <Helmet>
        <title>SignIn</title>
        <meta name="description" content="Description of SignIn" />
      </Helmet>
      <Div>
        <Card bodyStyle={{ margin: '24px 92px', padding: 0 }}>
          <Title
            style={{ textAlign: 'center', marginBottom: 32, color: '#5D2E8C' }}
            level={3}
          >
            Sign In
          </Title>
          <Form
            {...layout}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email address!' },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
            <div
              style={{ marginTop: 30, marginBottom: 10, textAlign: 'center' }}
            >
              Or
            </div>

            <GoogleButton callback={loginGoogle} />
          </Form>
        </Card>
      </Div>
    </div>
  );
});

const Div = styled.div``;
