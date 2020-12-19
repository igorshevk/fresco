/**
 *
 * EmailConfirmation
 *
 */

import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectEmailConfirmation } from './selectors';
import { emailConfirmationSaga } from './saga';

interface Props {}
interface ParamType {
  code: string;
}

export const EmailConfirmation = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: emailConfirmationSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const emailConfirmation = useSelector(selectEmailConfirmation);
  // const { loading } = useSelector(selectEmailConfirmation);
  const { code } = useParams<ParamType>();
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.emailConfirmationRequest({ code, history }));
  }, [history, code, dispatch]);

  return (
    <>
      <Helmet>
        <title>EmailConfirmation</title>
        <meta name="description" content="Description of EmailConfirmation" />
      </Helmet>
      <Div>
        <Spin size="large" />
      </Div>
    </>
  );
});

const Div = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
