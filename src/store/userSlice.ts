import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
}

const initialState: UserState = {
  userId: null,
  firstName: null,
  lastName: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ userId: string; firstName: string; lastName: string }>) => {
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
    clearUserData: (state) => {
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export const selectUserId = (state: { user: UserState }) => state.user.userId;
export const selectFirstName = (state: { user: UserState }) => state.user.firstName;
export const selectLastName = (state: { user: UserState }) => state.user.lastName;

export default userSlice.reducer; 