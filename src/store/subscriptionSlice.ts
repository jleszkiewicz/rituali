import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  showSubscriptionModal: boolean;
  refreshTrigger: number;
}

const initialState: SubscriptionState = {
  showSubscriptionModal: false,
  refreshTrigger: 0,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setShowSubscriptionModal: (state, action: PayloadAction<boolean>) => {
      state.showSubscriptionModal = action.payload;
    },
    triggerRefresh: (state) => {
      state.refreshTrigger += 1;
    },
  },
});

export const { setShowSubscriptionModal, triggerRefresh } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 