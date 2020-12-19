import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.checkEmailView || initialState;

export const selectCheckEmailView = createSelector(
  [selectDomain],
  checkEmailViewState => checkEmailViewState,
);
