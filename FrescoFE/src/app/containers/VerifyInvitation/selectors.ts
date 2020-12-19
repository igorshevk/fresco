import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.verifyInvitation || initialState;

export const selectVerifyInvitation = createSelector(
  [selectDomain],
  verifyInvitationState => verifyInvitationState,
);
