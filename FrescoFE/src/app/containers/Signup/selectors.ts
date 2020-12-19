import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.signup || initialState;

export const selectSignup = createSelector(
  [selectDomain],
  signupState => signupState,
);
