import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  email: string | null;
}

const initialState: UserState = {
  userId: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ userId: string; email: string }>) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    clearUserData: (state) => {
      state.userId = null;
      state.email = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export const selectUserId = (state: { user: UserState }) => state.user.userId;
export const selectEmail = (state: { user: UserState }) => state.user.email;

export default userSlice.reducer; 