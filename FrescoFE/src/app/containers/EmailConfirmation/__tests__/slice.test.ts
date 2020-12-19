import * as slice from '../slice';
import { ContainerState } from '../types';

describe('EmailConfirmation slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should handle emailConfirmationRequest', () => {
    const payload = {
      loading: true,
    };

    expect(
      slice.reducer(state, slice.actions.emailConfirmationRequest(payload)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: payload.loading,
    });
  });

  it('should handle emailConfirmationSuccess', () => {
    const payload = {
      loading: false,
    };
    expect(
      slice.reducer(state, slice.actions.emailConfirmationSuccess(payload)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: payload.loading,
    });
  });
  it('should handle emailConfirmationError', () => {
    expect(
      slice.reducer(state, slice.actions.emailConfirmationError()),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: false,
    });
  });
});
