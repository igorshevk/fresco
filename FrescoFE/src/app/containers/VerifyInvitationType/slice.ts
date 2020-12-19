import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the VerifyInvitation container
export const initialState: ContainerState = {
  loading: false,
};

const verifyInvitationTypeSlice = createSlice({
  name: 'verifyInvitationType',
  initialState,
  reducers: {
    verifyInvitationTypeRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    verifyInvitationTypeSuccess(state, action: PayloadAction<any>) {
      // console.log(action.payload);
      state.loading = false;
    },

    verifyInvitationTypeError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = verifyInvitationTypeSlice;
