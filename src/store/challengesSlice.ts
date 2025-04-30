import { Challenge } from '@/components/AddHabitModal/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChallengesState {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChallengesState = {
  challenges: [],
  isLoading: false,
  error: null,
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.challenges = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setChallenges, setLoading, setError } = challengesSlice.actions;

export const selectChallenges = (state: { challenges: ChallengesState }) => state.challenges.challenges;
export const selectChallengesLoading = (state: { challenges: ChallengesState }) => state.challenges.isLoading;
export const selectChallengesError = (state: { challenges: ChallengesState }) => state.challenges.error;

export default challengesSlice.reducer; 