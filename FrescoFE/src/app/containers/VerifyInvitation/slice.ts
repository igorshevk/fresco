import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the VerifyInvitation container
export const initialState: ContainerState = {
  loading: false,
};

const verifyInvitationSlice = createSlice({
  name: 'verifyInvitation',
  initialState,
  reducers: {
    verifyInvitationRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    verifyInvitationSuccess(state, action: PayloadAction<any>) {
      // console.log(action.payload);
      state.loading = false;
    },

    verifyInvitationError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = verifyInvitationSlice;
