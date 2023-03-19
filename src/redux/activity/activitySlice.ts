import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  firstDay: new Date().toISOString(),
};

const userSlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setGlobalActivityDetails(state, action: PayloadAction<{firstDay: string}>) {
      const {firstDay} = action.payload;
      state.firstDay = firstDay;
    },
  },
});

export const {setGlobalActivityDetails} = userSlice.actions;

export default userSlice.reducer;
