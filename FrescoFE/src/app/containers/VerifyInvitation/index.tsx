/**
 *
 * VerifyInvitation
 *
 */

import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { verifyInvitationSaga } from './saga';

interface Props {
  match: any;
}

export const VerifyInvitation = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: verifyInvitationSaga });

  const token = props?.match?.params?.token;

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(
      actions.verifyInvitationRequest({
        token,
        history,
      }),
    );
  }, [dispatch, history, token]);

  return (
    <>
      <Helmet>
        <title>VerifyInvitation</title>
        <meta name="description" content="Description of VerifyInvitation" />
      </Helmet>
    </>
  );
});
