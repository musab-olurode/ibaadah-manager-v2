import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './loading/loadingSlice';
import userReducer from './user/userSlice';
import activityReducer from './activity/activitySlice';

export const reduxStore = configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;

export type AppDispatch = typeof reduxStore.dispatch;
