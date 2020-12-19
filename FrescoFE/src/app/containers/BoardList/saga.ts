import { all, put, takeEvery } from 'redux-saga/effects';
import { message } from 'antd';
import { actions } from './slice';
import axios from 'axios';
import Auth from 'services/Auth';
axios.defaults.headers.common['Authorization'] = `Bearer ${Auth.getToken()}`;

// import { actions as globalActions } from '../../slice';
export function* getBoards(action) {
  const { payload } = action;

  try {
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${Auth.getToken()}`;
    const response = yield axios.get(`/board/organization/${payload}`);

    yield put(actions.getBoardsSuccess(response.data));
  } catch (error) {
    yield put(actions.getBoardsFail());
    message.error(error.message);
  }
}

export function* boardListSaga() {
  yield all([takeEvery(actions.attemptGetBoards.type, getBoards)]);
}
