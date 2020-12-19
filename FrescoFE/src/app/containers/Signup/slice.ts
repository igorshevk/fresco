import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the Signup container
export const initialState: ContainerState = {
  token: null,
  loading: false,
  errorCode: null,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    signUpRequest(state, action: PayloadAction<any>) {
      state.errorCode = null;
      state.loading = true;
    },

    // TODO: define Payload type and use here
    signUpSuccess(state) {
      state.loading = false;
    },

    signUpError(state, action: PayloadAction<any>) {
      state.errorCode = action.payload.status;
      state.loading = false;
    },

    signUpErrorReset(state) {
      state.errorCode = null;
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = signupSlice;
