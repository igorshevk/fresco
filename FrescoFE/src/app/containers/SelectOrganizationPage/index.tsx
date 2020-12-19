/**
 *
 * SelectOrganizationPage
 *
 */

import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Typography, Form, Row, Input, Col } from 'antd';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectSelectOrganizationPage } from './selectors';
import { companySelectSaga } from './saga';
import { selectToken } from 'app/selectors';

interface Props {}

export const SelectOrganizationPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: companySelectSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectOrganizationPage = useSelector(selectSelectOrganizationPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const { Title, Text } = Typography;
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
  const history = useHistory();
  const token = useSelector(selectToken);

  const onFinish = values => {
    // history.push('/');
    dispatch(
      actions.selectOrganizationRequest({ data: values, token, history }),
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
        <title>SignIn</title>
        <meta name="description" content="Description of SignIn" />
      </Helmet>
      <Div>
        <Card bodyStyle={{ padding: '24px 92px 68px 92px' }}>
          <Title style={{ textAlign: 'center', color: '#5D2E8C' }} level={3}>
            Welcome to Fresco
          </Title>
          <div style={{ textAlign: 'center', marginTop: 85, marginBottom: 32 }}>
            <Text>
              "QuestionPro" is here release the power of collaboration with your
              team"
            </Text>
          </div>
          <Form
            {...layout}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Enter first name!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Enter last name!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true, message: 'Enter organization name!' }]}
            >
              <Input />
            </Form.Item>
            <div
              style={{ textAlign: 'center', marginTop: 32, marginBottom: 32 }}
            >
              <Text>"Workspace: frescopad.com/questionpro"</Text>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={selectOrganizationPage.loading}
            >
              Continue
            </Button>
          </Form>
        </Card>
      </Div>
    </div>
  );
});

const Div = styled.div``;
