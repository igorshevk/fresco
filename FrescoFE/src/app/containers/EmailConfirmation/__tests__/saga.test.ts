import { put } from 'redux-saga/effects';
import { actions } from '../slice';

import { emailConfirmation, emailConfirmationSaga } from '../saga';

describe('EmailConfirmation-> Saga-> EmailConfirmation', () => {
  let emailConfirmationSagaIterator: ReturnType<typeof emailConfirmation>;
  beforeEach(() => {
    const data = {
      username: 'example',
      workEmail: 'example@fresco.com',
      password: 'admin123',
    };

    const action = actions.emailConfirmationRequest({
      history: { push: () => {} },
      data,
    });

    emailConfirmationSagaIterator = emailConfirmation(action);

    const { payload } = action;

    const requestDescriptor = emailConfirmationSagaIterator.next(payload).value;

    expect(requestDescriptor).toMatchSnapshot();
  });

  it('emailConfirmation success', () => {
    const iteration = emailConfirmationSagaIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('emailConfirmation error', () => {
    const data = {
      username: 'example',
      workEmail: 'example@fresco.com',
      password: 'admin123',
    };

    const action = actions.emailConfirmationRequest({
      history: { push: () => {} },
      data,
    });

    emailConfirmationSagaIterator = emailConfirmation(action);

    const { payload } = action;

    const requestDescriptor = emailConfirmationSagaIterator.next();
    expect(requestDescriptor).toMatchSnapshot();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    emailConfirmationSagaIterator.throw({
      error: {},
      history: {},
    }).value;

    const iteration = emailConfirmationSagaIterator.next();
    expect(iteration.done).toBe(true);
  });
});
describe('EmailConfirmation-> Saga-> EmailConfirmation', () => {
  it('EmailConfirmationSaga watch all', () => {
    let emailConfirmationWatchAllIterator: ReturnType<typeof emailConfirmationSaga>;
    emailConfirmationWatchAllIterator = emailConfirmationSaga();
    const watchDescriptor = emailConfirmationWatchAllIterator.next().value;
    expect(watchDescriptor).toMatchSnapshot();
  });
});
