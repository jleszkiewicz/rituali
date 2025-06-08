import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabsState {
  activeChallengesTab: "your" | "discover";
}

const initialState: TabsState = {
  activeChallengesTab: "your",
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setActiveChallengesTab: (state, action: PayloadAction<"your" | "discover">) => {
      state.activeChallengesTab = action.payload;
    },
  },
});

export const { setActiveChallengesTab } = tabsSlice.actions;
export default tabsSlice.reducer; 