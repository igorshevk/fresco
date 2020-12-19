import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.listOrganizations || initialState;

export const selectListOrganizations = createSelector(
  [selectDomain],
  listOrganizationsState => listOrganizationsState,
);
