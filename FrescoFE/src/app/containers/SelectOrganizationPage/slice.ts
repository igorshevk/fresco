import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the SelectOrganizationPage container
export const initialState: ContainerState = {
  loading: false,
};

const selectOrganizationPageSlice = createSlice({
  name: 'selectOrganizationPage',
  initialState,
  reducers: {
    selectOrganizationRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    selectOrganizationRequestSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
    },

    selectOrganizationRequestError(state) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = selectOrganizationPageSlice;
