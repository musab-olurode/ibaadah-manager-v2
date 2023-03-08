import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../utils/storage';

const initialState: User = {
  name: '',
  avatarPath: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<User>) {
      const {name, avatarPath} = action.payload;
      state.name = name;
      state.avatarPath = avatarPath;
    },
  },
});

export const {setUserDetails} = userSlice.actions;

export default userSlice.reducer;
