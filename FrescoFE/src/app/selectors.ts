import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const globalDomain = (state: RootState) => state.global || initialState;

export const selectToken = createSelector(
  [globalDomain],
  globalState => globalState.token,
);

export const selectUser = createSelector(
  [globalDomain],
  globalState => globalState.user,
);
