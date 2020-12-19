import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the CheckEmailView container
export const initialState: ContainerState = {};

const checkEmailViewSlice = createSlice({
  name: 'checkEmailView',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = checkEmailViewSlice;
