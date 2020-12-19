import { takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import { actions } from './slice';

// import { actions as globalActions } from '../../slice';

export function* emailConfirmation(action) {
  const { payload } = action;
  const { history } = payload;
  try {
    yield axios.get(`auth/confirm/${payload.code}`);
    message.success('Email is confirmed. Please login.');
    history.push('/auth/login');
  } catch (error) {
    history.push('/auth/login');
    message.error(error.message);
    message.error('Please try again.');
  }
}

export function* emailConfirmationSaga() {
  yield takeLatest(actions.emailConfirmationRequest.type, emailConfirmation);
}
