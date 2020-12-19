import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SignupForInvitation container
export const initialState: ContainerState = {
  token: null,
  loading: false,
};

const signupForInvitationSlice = createSlice({
  name: 'signupForInvitation',
  initialState,
  reducers: {
    signUpForInvitationRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    signUpForInvitationSuccess(state) {
      state.loading = false;
    },

    signUpForInvitationError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = signupForInvitationSlice;
