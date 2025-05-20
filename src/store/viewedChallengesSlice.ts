import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ViewedChallengesState {
  viewedChallengeIds: string[];
}

const initialState: ViewedChallengesState = {
  viewedChallengeIds: [],
};

const viewedChallengesSlice = createSlice({
  name: "viewedChallenges",
  initialState,
  reducers: {
    markChallengeAsViewed: (state, action: PayloadAction<string>) => {
      if (!state.viewedChallengeIds.includes(action.payload)) {
        state.viewedChallengeIds.push(action.payload);
      }
    },
  },
});

export const { markChallengeAsViewed } = viewedChallengesSlice.actions;
export const selectViewedChallengeIds = (state: { viewedChallenges: ViewedChallengesState }) =>
  state.viewedChallenges.viewedChallengeIds;

export default viewedChallengesSlice.reducer; 