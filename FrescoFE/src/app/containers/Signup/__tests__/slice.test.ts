import * as slice from '../slice';
import { ContainerState } from '../types';

describe('SignUp slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should handle signUpRequest', () => {
    const payload = {
      loading: true,
    };

    expect(slice.reducer(state, slice.actions.signUpRequest(payload))).toEqual<
      ContainerState
    >({
      ...slice.initialState,
      loading: payload.loading,
    });
  });

  it('should handle signUpSuccess', () => {
    expect(slice.reducer(state, slice.actions.signUpSuccess())).toEqual<
      ContainerState
    >({
      ...slice.initialState,
      loading: false,
    });
  });
  it('should handle signinError', () => {
    expect(
      slice.reducer(state, slice.actions.signUpError({ status: null })),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: false,
    });
  });

  it('should handle signInErrorReset', () => {
    expect(slice.reducer(state, slice.actions.signUpErrorReset())).toEqual<
      ContainerState
    >({
      ...slice.initialState,
      loading: false,
    });
  });
});
