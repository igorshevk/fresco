import { put } from 'redux-saga/effects';
import { actions } from '../slice';

import { signUp, signupSaga } from '../saga';

describe('SignUp-> Saga-> signUp', () => {
  let signUpSagaIterator: ReturnType<typeof signUp>;
  beforeEach(() => {
    const data = {
      username: 'example',
      workEmail: 'example@fres',
      password: 'admin123',
    };

    const action = actions.signUpRequest({
      history: { push: () => {} },
      data,
    });

    signUpSagaIterator = signUp(action);

    const { payload } = action;

    const requestDescriptor = signUpSagaIterator.next(payload).value;

    expect(requestDescriptor).toMatchSnapshot();
  });

  it('signUp success', () => {
    const successData = {
      username: 'example',
      role: 'USER',
    };
    const response = { data: successData };
    const postDescriptorSignUpSuccess = signUpSagaIterator.next(response).value;

    expect(postDescriptorSignUpSuccess).toEqual(put(actions.signUpSuccess()));

    const iteration = signUpSagaIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('signUp error 409', () => {
    const postDescriptorSignUpError = signUpSagaIterator.throw({
      response: { status: 409 },
    }).value;
    expect(postDescriptorSignUpError).toEqual(
      put(actions.signUpError({ status: 409 })),
    );
    signUpSagaIterator.next();
    signUpSagaIterator.next();
    signUpSagaIterator.next();
    const iteration = signUpSagaIterator.next();
    expect(iteration.done).toBe(true);
  });
  it('signUp error 500', () => {
    const postDescriptorSignUpError = signUpSagaIterator.throw({
      response: { status: 500 },
    }).value;
    expect(postDescriptorSignUpError).toEqual(
      put(actions.signUpError({ status: 500 })),
    );
    signUpSagaIterator.next();
    signUpSagaIterator.next();
    signUpSagaIterator.next();
    const iteration = signUpSagaIterator.next();
    expect(iteration.done).toBe(true);
  });
  it('signUp error reset', () => {
    const postDescriptorSignUpError = signUpSagaIterator.throw({
      response: { status: 409 },
    }).value;
    signUpSagaIterator.next();
    const postDescriptorSignUpErrorReset = signUpSagaIterator.next().value;
    expect(postDescriptorSignUpErrorReset).toEqual(
      put(actions.signUpErrorReset()),
    );

    const iteration = signUpSagaIterator.next();
    expect(iteration.done).toBe(true);
  });
});

describe('SignUp-> Saga-> signUpSaga', () => {
  it('signUpSaga watch all', () => {
    let signUpSagaWatchAllIterator: ReturnType<typeof signupSaga>;
    signUpSagaWatchAllIterator = signupSaga();
    const watchDescriptor = signUpSagaWatchAllIterator.next().value;
    expect(watchDescriptor).toMatchSnapshot();
  });
});
