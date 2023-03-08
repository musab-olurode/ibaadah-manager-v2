import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './loading/loadingSlice';
import userReducer from './user/userSlice';

export const reduxStore = configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;

export type AppDispatch = typeof reduxStore.dispatch;
