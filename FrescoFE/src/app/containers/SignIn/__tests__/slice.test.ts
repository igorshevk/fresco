import * as slice from '../slice';
import { ContainerState } from '../types';

describe('Signin slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should handle signInRequest', () => {
    const payload = {
      loading: true,
    };

    expect(slice.reducer(state, slice.actions.signInRequest(payload))).toEqual<
      ContainerState
    >({
      ...slice.initialState,
      loading: payload.loading,
    });
  });

  it('should handle signInSuccess', () => {
    const payload = {
      loading: false,
      user: {},
      errorMessage: '',
    };
    expect(slice.reducer(state, slice.actions.signInSuccess(payload))).toEqual<
      ContainerState
    >({
      ...slice.initialState,
      loading: payload.loading,
    });
  });
  it('should handle signinError', () => {
    expect(
      slice.reducer(state, slice.actions.signInError({ message: 'not found' })),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: false,
      error: 'not found',
    });
  });
});
