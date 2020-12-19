import { all, put, takeLatest } from 'redux-saga/effects';
import { actions } from '../slice';
import { actions as globalActions } from '../../../slice';

import { signIn, welcomePageSaga } from '../saga';

describe('SignIn-> Saga-> signIn', () => {
  let signInSagaIterator: ReturnType<typeof signIn>;
  beforeEach(() => {
    const token = '123';
    const action = actions.signInRequest({
      history: { push: () => {} },
      token,
    });
    signInSagaIterator = signIn(action);
    const { payload } = action;

    const requestDescriptor = signInSagaIterator.next(payload).value;

    expect(requestDescriptor).toMatchSnapshot();
  });

  it('signIn success', () => {
    const successData = {
      user: {
        username: 'tariq',
        role: 'USER',
        email: 'example@fresco.com',
      },
      token: {
        accessToken: '123',
      },
    };

    const putDescriptorSignInSuccess = signInSagaIterator.next({
      data: successData.user,
    }).value;
    expect(putDescriptorSignInSuccess).toEqual(
      put(actions.signInSuccess(successData.user)),
    );

    const putDescriptorSetAuthInformation = signInSagaIterator.next({
      data: successData.user,
    }).value;
    expect(putDescriptorSetAuthInformation).toEqual(
      put(globalActions.setAuthInformation(successData)),
    );
    const iteration = signInSagaIterator.next();
    expect(iteration.done).toBe(true);
    expect(localStorage.getItem('authInformation')).toBe(
      JSON.stringify(successData),
    );
  });

  it('signIn error', () => {
    const error = {
      message: 'Not found',
    };
    const putDescriptorSignInError = signInSagaIterator.throw(error).value;

    expect(putDescriptorSignInError).toEqual(put(actions.signInError()));
    const iteration = signInSagaIterator.next();
    expect(iteration.done).toBe(true);
  });
});

describe('SignIn-> Saga-> signInSaga', () => {
  it('signInSaga watch all', () => {
    let signInSagaWatchAllIterator: ReturnType<typeof welcomePageSaga>;
    signInSagaWatchAllIterator = welcomePageSaga();
    const watchDescriptor = signInSagaWatchAllIterator.next().value;
    expect(watchDescriptor).toMatchSnapshot();
  });
});
