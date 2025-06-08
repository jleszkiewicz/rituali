import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import habitsReducer from './habitsSlice';
import challengesReducer from './challengesSlice';
import viewedChallengesReducer from './viewedChallengesSlice';
import tabsReducer from './tabsSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    habits: habitsReducer,
    challenges: challengesReducer,
    viewedChallenges: viewedChallengesReducer,
    tabs: tabsReducer,
    subscription: subscriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 