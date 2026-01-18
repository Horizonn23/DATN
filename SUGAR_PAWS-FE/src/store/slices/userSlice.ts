import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define the user state interface
interface UserState {
  username: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
}

// Define the initial state
const initialState: UserState = {
  username: null,
  email: null,
  name: null,
  role: null,
};

// Create the user slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        username?: string;
        email?: string;
        name?: string;
        role?: string;
      }>,
    ) => {
      if (action.payload.username) state.username = action.payload.username;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.role) state.role = action.payload.role;
    },
    removeUser: () => {
      return initialState;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export const selectUsername = (state: RootState) => state.user.username;
export const selectEmail = (state: RootState) => state.user.email;
export const selectName = (state: RootState) => state.user.name;
export const selectRole = (state: RootState) => state.user.role;

export default userSlice.reducer;
