import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the Dashboard container
export const initialState: ContainerState = {
  loading: false,
  listEmail: [],
  linkInvitation: '',
};

const shareModalSlice = createSlice({
  name: 'shareModal',
  initialState,
  reducers: {
    searchEmailOrNameRequest(state, action: PayloadAction<any>) {
      state.linkInvitation = '';
      // state.loading = true;
    },

    // TODO: define Payload type and use here
    searchEmailOrNameSuccess(state, action: PayloadAction<any>) {
      // console.log(action.payload);
      state.listEmail = action.payload;
      // state.loading = false;
    },

    searchEmailOrNameError(state, action: PayloadAction<any>) {
      // state.loading = false;
    },

    invitationRequest(state, action: PayloadAction<any>) {
      state.linkInvitation = '';
      state.loading = true;
    },

    // TODO: define Payload type and use here
    invitationSuccess(state, action: PayloadAction<any>) {
      state.linkInvitation = action.payload;
      state.loading = false;
    },

    invitationError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = shareModalSlice;
