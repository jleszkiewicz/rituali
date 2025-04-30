import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import challengesReducer from './challengesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    challenges: challengesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 