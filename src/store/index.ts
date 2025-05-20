import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import habitsReducer from './habitsSlice';
import challengesReducer from './challengesSlice';
import viewedChallengesReducer from './viewedChallengesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    habits: habitsReducer,
    challenges: challengesReducer,
    viewedChallenges: viewedChallengesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 