import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.emailConfirmation || initialState;

export const selectEmailConfirmation = createSelector(
  [selectDomain],
  emailConfirmationState => emailConfirmationState,
);
