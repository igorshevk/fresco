import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.dashboard || initialState;

export const selectDashboard = createSelector(
  [selectDomain],
  dashboardState => dashboardState,
);
