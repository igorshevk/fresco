/**
 *
 * VerifyInvitationType
 *
 */

import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { verifyInvitationTypeSaga } from './saga';
import Auth from 'services/Auth';
import { selectToken } from '../../selectors';

interface Props {
  match: any;
}

export const VerifyInvitationType = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: verifyInvitationTypeSaga });

  const tokenVerify = props?.match?.params?.token;
  const token = useSelector(selectToken);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (history && tokenVerify) {
      if (!Auth.isLogged()) {
        localStorage.setItem('tokenVerify', JSON.stringify({ tokenVerify }));
        history.push('/auth/login');
      } else if (token) {
        dispatch(
          actions.verifyInvitationTypeRequest({
            tokenVerify,
            history,
            token,
          }),
        );
      }
    }
  }, [dispatch, history, tokenVerify, token]);

  return (
    <>
      <Helmet>
        <title>VerifyInvitationType</title>
        <meta
          name="description"
          content="Description of VerifyInvitationType"
        />
      </Helmet>
    </>
  );
});
