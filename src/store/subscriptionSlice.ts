import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  showSubscriptionModal: boolean;
}

const initialState: SubscriptionState = {
  showSubscriptionModal: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setShowSubscriptionModal: (state, action: PayloadAction<boolean>) => {
      state.showSubscriptionModal = action.payload;
    },
  },
});

export const { setShowSubscriptionModal } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 