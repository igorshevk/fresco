import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';
import { actions as globalActions } from '../../slice';
// import { actions as globalActions } from '../../slice';

export function* verifyInvitation(action) {
  const { payload } = action;
  const { history, token } = payload;
  // console.log('payload', token);
  try {
    const response = yield axios.get(`invitation/check/${token}`);
    // console.log('response', response);
    if (response?.data?.toUserId) {
      const res = yield axios.post('invitation/verify', {
        orgId: response.data.orgId,
        token: response.data.token,
        permission: response.data.permission,
        userId: response.data.toUserId,
      });
      yield put(globalActions.setAuthInformation(res.data));
      localStorage.setItem('authInformation', JSON.stringify(res.data));
      message.success('Logged in successfully.');
      history.push('/auth/welcome-page');
    } else {
      history.push('/auth/register-for-invitation', { data: response.data });
    }
    message.success('Invitation successfully.');
  } catch (error) {
    history.push('/err');
    yield put(
      actions.verifyInvitationError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* verifyInvitationSaga() {
  yield all([
    takeLatest(actions.verifyInvitationRequest.type, verifyInvitation),
  ]);
}
