import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the EmailConfirmation container
export const initialState: ContainerState = {
  loading: false,
};

const emailConfirmationSlice = createSlice({
  name: 'emailConfirmation',
  initialState,
  reducers: {
    emailConfirmationRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },
    // TODO: define Payload type and use here
    emailConfirmationSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    emailConfirmationError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = emailConfirmationSlice;
