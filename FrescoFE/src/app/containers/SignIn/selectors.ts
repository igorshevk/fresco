import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.signIn || initialState;

export const selectSignIn = createSelector(
  [selectDomain],
  signInState => signInState,
);

export const selectUser = createSelector(
  [selectDomain],
  signInState => signInState.user,
);
