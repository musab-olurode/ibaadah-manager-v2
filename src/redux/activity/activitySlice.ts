import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  firstDay: new Date().toISOString(),
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setGlobalActivityDetails(state, action: PayloadAction<{firstDay: string}>) {
      const {firstDay} = action.payload;
      state.firstDay = firstDay;
    },
  },
});

export const {setGlobalActivityDetails} = activitySlice.actions;

export default activitySlice.reducer;
