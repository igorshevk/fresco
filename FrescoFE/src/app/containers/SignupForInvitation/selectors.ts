import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.signupForInvitation || initialState;

export const selectSignupForInvitation = createSelector(
  [selectDomain],
  signupForInvitationState => signupForInvitationState,
);
