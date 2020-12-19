import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ListOrg container
export const initialState: ContainerState = {
  listOrganizations: [],
  loading: false,
};

const listOrganizationsSlice = createSlice({
  name: 'listOrganizations',
  initialState,
  reducers: {
    listOrganizationsRequest(state, action: PayloadAction<any>) {
      state.loading = true;
    },

    // TODO: define Payload type and use here
    listOrganizationsSuccess(state, action: PayloadAction<any>) {
      state.listOrganizations = action.payload;
      state.loading = false;
    },

    listOrganizationsError(state, action: PayloadAction<any>) {
      state.loading = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = listOrganizationsSlice;
