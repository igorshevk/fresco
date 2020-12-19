import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SignIn container
export const initialState: ContainerState = {
  loading: false,
  error: '',
  user: {},
};

const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    signInRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    signInSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.user = action.payload.user;
    },

    signInError(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { actions, reducer, name: sliceKey } = signInSlice;
