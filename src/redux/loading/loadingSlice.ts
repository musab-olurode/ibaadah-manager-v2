import {createSlice} from '@reduxjs/toolkit';

const initialState = false;

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading() {
      return true;
    },

    hideLoading() {
      return false;
    },
  },
});

export const {showLoading, hideLoading} = loadingSlice.actions;

export default loadingSlice.reducer;
