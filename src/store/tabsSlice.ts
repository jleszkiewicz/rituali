import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabsState {
  activeChallengesTab: "your" | "discover";
  activeFriendsTab: "friends" | "competition";
}

const initialState: TabsState = {
  activeChallengesTab: "your",
  activeFriendsTab: "friends",
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setActiveChallengesTab: (state, action: PayloadAction<"your" | "discover">) => {
      state.activeChallengesTab = action.payload;
    },
    setActiveFriendsTab: (state, action: PayloadAction<"friends" | "competition">) => {
      state.activeFriendsTab = action.payload;
    },
  },
});

export const { setActiveChallengesTab, setActiveFriendsTab } = tabsSlice.actions;
export default tabsSlice.reducer; 