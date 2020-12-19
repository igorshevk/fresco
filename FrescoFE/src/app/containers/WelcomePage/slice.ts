import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the WelcomePage container
export const initialState: ContainerState = {
  loading: false,
};

const welcomePageSlice = createSlice({
  name: 'welcomePage',
  initialState,
  reducers: {
    signInRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    signInSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    signInError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = welcomePageSlice;
