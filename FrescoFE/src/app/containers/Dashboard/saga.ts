import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';
import { v4 as uuidv4 } from 'uuid';

// import { actions as globalActions } from '../../slice';

export function* searchEmail(action) {
  const { payload } = action;
  // console.log('payload', payload);
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
    const response = yield axios.post('/users/suggest', {
      email: payload.data.email,
      orgId: payload.data.orgId,
    });
    // console.log('response', response);
    yield put(actions.searchEmailSuccess(response.data));
  } catch (error) {
    yield put(
      actions.searchEmailError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* invitation(action) {
  const { payload } = action;
  const { history, permission, token, orgId, data } = payload;
  const feToken = uuidv4();
  // console.log('payload', data, payload?.data[0], feToken);
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('invitation', {
      toUserId: data[0]?.id || '',
      toEmail: data[0]?.email || data.email,
      token: feToken,
      permission,
      orgId,
    });
    // console.log('response', response);
    yield put(actions.invitationSuccess(response.data));
    message.success('Invitation successfully.');
  } catch (error) {
    history.push('/err');
    yield put(
      actions.invitationError({
        message: error.message,
        status: error.response.status,
      }),
    );
    message.error(error.message);
  }
}

export function* dashboardSaga() {
  yield all([
    takeLatest(actions.searchEmailRequest.type, searchEmail),
    takeLatest(actions.invitationRequest.type, invitation),
  ]);
}
