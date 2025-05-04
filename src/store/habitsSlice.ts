import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HabitData } from '@/components/AddHabitModal/types';

interface HabitsState {
  habits: HabitData[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null,
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<HabitData[]>) => {
      state.habits = action.payload;
    },
    addHabit: (state, action: PayloadAction<HabitData>) => {
      state.habits.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setHabits, addHabit, setLoading, setError } = habitsSlice.actions;
export const selectHabits = (state: { habits: HabitsState }) => state.habits.habits;
export const selectHabitsLoading = (state: { habits: HabitsState }) => state.habits.loading;
export const selectHabitsError = (state: { habits: HabitsState }) => state.habits.error;

export default habitsSlice.reducer; 