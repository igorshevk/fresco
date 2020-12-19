import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the BoardList container
export const initialState: ContainerState = {
  loading: false,
  boardList: [],
};

const boardListSlice = createSlice({
  name: 'boardList',
  initialState,
  reducers: {
    attemptGetBoards(state, action) {
      state.loading = true;
    },
    getBoardsSuccess(state, action: PayloadAction<any>) {
      state.boardList = action.payload;
      state.loading = false;
    },
    getBoardsFail(state) {
      state.boardList = [];
      state.loading = false;
    },
    deleteBoard(state, action) {
      console.log('action', action);
      console.log('state.boardList', state.boardList);
      state.boardList = state.boardList.filter(
        board => board.id !== action.payload,
      );
    },
  },
});

export const { actions, reducer, name: sliceKey } = boardListSlice;
