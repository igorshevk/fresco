import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.verifyInvitationType || initialState;

export const selectVerifyInvitationType = createSelector(
  [selectDomain],
  verifyInvitationTypeState => verifyInvitationTypeState,
);
