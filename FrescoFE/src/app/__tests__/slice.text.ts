import * as slice from '../slice';
import { ContainerState } from '../types';

describe('main file slice slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should handle setAuthInformation', () => {
    const payload = {
      token: { accessToken: '123' },
      user: {
        name: 'example',
        email: 'example@fresco.com',
        role: 'USER',
        id: '1',
      },
    };

    expect(
      slice.reducer(state, slice.actions.setAuthInformation(payload)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      token: payload.token.accessToken,
      user: payload.user,
    });
  });

  it('should handle setAuthInformation', () => {
    expect(slice.reducer(state, slice.actions.removeAuth())).toEqual<
      ContainerState
    >({
      ...slice.initialState,
      user: null,
      token: null,
    });
  });
});
