import { all, put, takeLatest } from 'redux-saga/effects';
import { message, Modal } from 'antd';
import axios from 'axios';

import { actions } from './slice';
function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}
export function* signUp(action) {
  try {
    const { payload } = action;
    const { data, history } = payload;
    yield axios.post('auth/register', data);
    yield put(actions.signUpSuccess());
    message.success(`You're registered successfully.`);
    history.push('/auth/check-email');
  } catch (error) {
    if (error.response.status !== 409) {
      message.error(error.message);
    }
    yield put(actions.signUpError(error.response));
    yield sleep(2);
    yield put(actions.signUpErrorReset());
  }
}

export function* signupSaga() {
  yield all([takeLatest(actions.signUpRequest.type, signUp)]);
}
