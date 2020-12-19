import { all, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';

import { actions } from './slice';

export function* companySelect(action) {
  const { payload } = action;
  const { history, data, token } = payload;
  try {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = yield axios.post('organization/', {
      name: data.company,
      fName: data.firstName,
      lName: data.lastName,
    });

    yield put(actions.selectOrganizationRequestSuccess(response.data));
    message.success('Create organization successfully.');
    history.push(`/organization/${response.data?.id}`);
  } catch (error) {
    yield put(actions.selectOrganizationRequestError());
    message.error(
      error?.response?.data?.message ?? 'There is an issue on our side',
    );
  }
}

export function* companySelectSaga() {
  yield all([
    takeLatest(actions.selectOrganizationRequest.type, companySelect),
  ]);
}
