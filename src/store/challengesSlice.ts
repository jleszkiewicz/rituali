import { ChallengeData } from '@/components/AddChallengeModal/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChallengesState {
  challenges: ChallengeData[];
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
    setChallenges: (state, action: PayloadAction<ChallengeData[]>) => {
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