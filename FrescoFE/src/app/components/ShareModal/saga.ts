import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

// import { actions as globalActions } from '../../slice';

export function* searchEmail(action) {
  const { payload } = action;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
    const response = yield axios.get(
      `/users/search?keyword=${payload.keyword}`,
    );
    console.log('response', response);
    yield put(actions.searchEmailOrNameSuccess(response.data));
  } catch (error) {
    yield put(
      actions.searchEmailOrNameError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* invitation(action) {
  const { payload } = action;
  const { listEmailAndPermission, token, messageInvite, isNoti } = payload;
  console.log('payload', payload);
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('invitation/type-email', {
      invitationEmails: listEmailAndPermission,
      notify: isNoti ? 1 : 0,
      message: messageInvite,
    });
    console.log('response', response);
    yield put(actions.invitationSuccess(response.data));
    message.success('Invitation successfully.');
  } catch (error) {
    yield put(
      actions.invitationError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(`Invitation error: ${error.message}`);
  }
}

export function* shareModalSaga() {
  yield all([
    takeLatest(actions.searchEmailOrNameRequest.type, searchEmail),
    takeLatest(actions.invitationRequest.type, invitation),
  ]);
}
