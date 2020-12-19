import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.welcomePage || initialState;

export const selectWelcomePage = createSelector(
  [selectDomain],
  welcomePageState => welcomePageState,
);
