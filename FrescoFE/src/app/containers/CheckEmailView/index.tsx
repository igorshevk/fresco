/**
 *
 * CheckEmailView
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { Card, Typography } from 'antd';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectCheckEmailView } from './selectors';
import { checkEmailViewSaga } from './saga';

interface Props {}

export const CheckEmailView = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: checkEmailViewSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkEmailView = useSelector(selectCheckEmailView);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const { Title } = Typography;

  return (
    <>
      <Helmet>
        <title>CheckEmailView</title>
        <meta name="description" content="Description of CheckEmailView" />
      </Helmet>
      <Div>
        <Card style={{ width: 500, height: 300 }}>
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <Title level={3} type="success">
              Email was sent
            </Title>
            <br />
            <Typography.Paragraph
              type="secondary"
              style={{ textAlign: 'justify' }}
            >
              An confirmation link is sent to you email address. Please open
              your inbox and click on the confirmation link, if you're unable to
              find the confirmation email then please check the spam section.
              Try to refresh the inbox and wait for few minutes otherwise
              contact our support team.
            </Typography.Paragraph>
          </div>
        </Card>
      </Div>
    </>
  );
});

const Div = styled.div`
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
