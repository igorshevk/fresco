import { all, put, takeLatest } from 'redux-saga/effects';
import { message, Modal } from 'antd';
import axios from 'axios';

import { actions } from './slice';
import { actions as globalActions } from '../../slice';

export function* signUpForInvitation(action) {
  try {
    const { payload } = action;
    const { data, token, history } = payload;
    const response = yield axios.post(`auth/createUser/${token}`, data);
    yield put(actions.signUpForInvitationSuccess());
    message.success(`You're registered successfully.`);
    yield put(globalActions.setAuthInformation(response.data));
    localStorage.setItem('authInformation', JSON.stringify(response.data));
    history.push('/auth/welcome-page');
  } catch (error) {
    if (error.response.status === 409) {
      Modal.confirm({
        content:
          'User already exists with this email, please try again with different email address.',
      });
    } else {
      message.error(error.message);
    }
    yield put(actions.signUpForInvitationError());
  }
}
export function* signupForInvitationSaga() {
  yield all([
    takeLatest(actions.signUpForInvitationRequest.type, signUpForInvitation),
  ]);
}
