import {configureStore} from '@reduxjs/toolkit';
import loadingReducer from './loading/loadingSlice';
import userReducer from './user/userSlice';
import activityReducer from './activity/activitySlice';
import themeReducer from './theme/themeSlice';

export const reduxStore = configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
    activity: activityReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;

export type AppDispatch = typeof reduxStore.dispatch;
