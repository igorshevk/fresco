import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.selectOrganizationPage || initialState;

export const selectSelectOrganizationPage = createSelector(
  [selectDomain],
  selectOrganizationPageState => selectOrganizationPageState,
);
