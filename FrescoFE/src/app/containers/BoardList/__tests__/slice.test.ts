import * as slice from '../slice';
import { ContainerState } from '../types';

describe('Signin slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should handle getBoardsRequest', () => {
    const payload = {
      loading: true,
    };

    expect(
      slice.reducer(state, slice.actions.attemptGetBoards(payload)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: payload.loading,
    });
  });

  it('should handle getBoardsSuccess', () => {
    const payload = [
      { id: '1', data: '', path: '', name: 'board1' },
      { id: '2', data: '', path: '', name: 'board2' },
    ];
    expect(
      slice.reducer(state, slice.actions.getBoardsSuccess(payload)),
    ).toMatchObject<ContainerState>({
      loading: false,
      boardList: payload,
    });
  });
  it('should handle getBoardsError', () => {
    expect(slice.reducer(state, slice.actions.getBoardsFail())).toEqual<
      ContainerState
    >({
      ...slice.initialState,
      loading: false,
    });
  });
});
