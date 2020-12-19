import { all, put, takeLatest } from 'redux-saga/effects';
import { actions } from '../slice';
import { actions as globalActions } from '../../../slice';

import { signIn, signInSaga } from '../saga';

describe('SignIn-> Saga-> signIn', () => {
  let signInSagaIterator: ReturnType<typeof signIn>;
  beforeEach(() => {
    const data = {
      email: 'example@fresco.com',
      password: 'admin123',
    };

    const action = actions.signInRequest({
      history: { push: () => {} },
      data,
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
      },
      token: {
        accessToken: '123',
      },
    };
    const response = { data: successData };
    const putDescriptorSignInSuccess = signInSagaIterator.next(response).value;

    expect(putDescriptorSignInSuccess).toEqual(
      put(actions.signInSuccess(successData)),
    );

    const putDescriptorSetAuthInformation = signInSagaIterator.next(response)
      .value;
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
      response: { status: 404 },
      message: 'Not found',
    };
    const putDescriptorSignInError = signInSagaIterator.throw(error).value;

    expect(putDescriptorSignInError).toEqual(
      put(
        actions.signInError({
          message: error.message,
          status: error.response.status,
        }),
      ),
    );
    const iteration = signInSagaIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('signIn error', () => {
    const error = {
      response: { status: 401 },
      message: 'Unauthorized',
    };
    const putDescriptorSignInError = signInSagaIterator.throw(error).value;

    expect(putDescriptorSignInError).toEqual(
      put(
        actions.signInError({
          message: error.message,
          status: error.response.status,
        }),
      ),
    );
    const iteration = signInSagaIterator.next();
    expect(iteration.done).toBe(true);
  });
  it('signIn error', () => {
    const error = {
      response: { status: 422 },
      message: 'Bad Request',
    };
    const putDescriptorSignInError = signInSagaIterator.throw(error).value;

    expect(putDescriptorSignInError).toEqual(
      put(
        actions.signInError({
          message: error.message,
          status: error.response.status,
        }),
      ),
    );
    const iteration = signInSagaIterator.next();
    expect(iteration.done).toBe(true);
  });
});

describe('SignIn-> Saga-> signInSaga', () => {
  it('signInSaga watch all', () => {
    let signInSagaWatchAllIterator: ReturnType<typeof signInSaga>;
    signInSagaWatchAllIterator = signInSaga();
    const watchDescriptor = signInSagaWatchAllIterator.next().value;
    expect(watchDescriptor).toMatchSnapshot();
  });
});
