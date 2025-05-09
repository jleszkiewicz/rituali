import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import habitsReducer from './habitsSlice';
import challengesReducer from './challengesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    habits: habitsReducer,
    challenges: challengesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 