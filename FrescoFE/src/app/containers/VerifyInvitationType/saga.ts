import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

export function* verifyInvitationType(action) {
  const { payload } = action;
  const { tokenVerify, history, token } = payload;
  console.log('payload', token);
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('invitation-type/request', {
      token: tokenVerify,
    });
    console.log('response', response);
    if (response?.data?.typeId) {
      history.push(
        `/canvas/${response?.data?.typeId}/${response?.data?.type}`,
        {
          orgId: response?.data?.orgId,
        },
      );
    }
    message.success('Invitation successfully.');
  } catch (error) {
    history.push('/');
    yield put(
      actions.verifyInvitationTypeError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(`Invitation : ${error.message}`);
  }
}

export function* verifyInvitationTypeSaga() {
  yield all([
    takeLatest(actions.verifyInvitationTypeRequest.type, verifyInvitationType),
  ]);
}
