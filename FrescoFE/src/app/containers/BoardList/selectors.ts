import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.boardList || initialState;

export const selectBoardList = createSelector(
  [selectDomain],
  boardListState => boardListState,
);
