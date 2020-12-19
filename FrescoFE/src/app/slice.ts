import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the global container
export const initialState: ContainerState = {
  token: null,
  user: null,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setAuthInformation(state, action: PayloadAction<any>) {
      state.token = action.payload.token.accessToken;
      state.user = action.payload.user;
    },
    removeAuth(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = globalSlice;
