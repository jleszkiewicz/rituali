import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 