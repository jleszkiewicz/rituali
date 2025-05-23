import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  email: string | null;
  displayName: string | null;
}

const initialState: UserState = {
  userId: null,
  email: null,
  displayName: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ userId: string; email: string; displayName?: string }>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName || null;
    },
    clearUserData: (state) => {
      state.userId = null;
      state.email = null;
      state.displayName = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export const selectUserId = (state: { user: UserState }) => state.user.userId;
export const selectEmail = (state: { user: UserState }) => state.user.email;
export const selectDisplayName = (state: { user: UserState }) => state.user.displayName;

export default userSlice.reducer; 