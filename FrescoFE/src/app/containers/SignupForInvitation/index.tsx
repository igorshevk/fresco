/**
 *
 * SignupForInvitation
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Input, Button, Card, Typography } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectSignupForInvitation } from './selectors';
import { signupForInvitationSaga } from './saga';

interface Props {}

interface IState {
  data?: any;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Title } = Typography;

// const tailLayout = {
//   wrapperCol: { offset: 0, span: 24 },
// };

export const SignupForInvitation = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: signupForInvitationSaga });
  const history = useHistory();
  const location = useLocation();
  const data = (location.state as IState).data;
  console.log('SignupForInvitation', data);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading } = useSelector(selectSignupForInvitation);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const onFinish = values => {
    console.log('Success:', values);
    dispatch(
      actions.signUpForInvitationRequest({
        data: values,
        token: data.token,
        history,
      }),
    );
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
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
        <title>Sign up</title>
        <meta name="description" content="Description of SignupForInvitation" />
      </Helmet>
      <Card bodyStyle={{ margin: '24px 92px', padding: 0 }}>
        <Title
          style={{ textAlign: 'center', marginBottom: 32, color: '#5D2E8C' }}
          level={3}
        >
          Sign Up
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
            label="Work Email"
            name="email"
            initialValue={data.toEmail}
            rules={[
              { required: true, message: 'Please input your email address!' },
            ]}
          >
            <Input disabled={!!data.toEmail} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            style={{ marginTop: 20 }}
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Sign Up
          </Button>
        </Form>
      </Card>
    </div>
  );
});
