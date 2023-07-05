import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Theme} from '../../types/global';

const initialState = {
  theme: Theme.FOLLOW_SYSTEM,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setAppTheme(state, action: PayloadAction<Theme>) {
      const theme = action.payload;
      state.theme = theme;
    },
  },
});

export const {setAppTheme} = themeSlice.actions;

export default themeSlice.reducer;
