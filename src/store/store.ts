import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "./habitsSlice";
import challengesReducer from "./challengesSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    challenges: challengesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 