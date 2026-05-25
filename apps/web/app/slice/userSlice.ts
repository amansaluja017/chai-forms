import { createSlice } from "@reduxjs/toolkit";

type User = {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  emailVerified: boolean;
  provider: "google" | "local";
  is2FAEnabled: boolean;
};

type UserState = {
  accessToken?: string | null;
  status: boolean;
  loading: boolean;
  user: User | null;
};

type Payload = {
  accessToken?: string | null;
  loading: boolean;
  user: User | null;
};

const initialState: UserState = { status: false, accessToken: null, loading: true, user: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state: UserState, action: {payload: Payload}) => {
      state.accessToken = action.payload.accessToken;
      state.status = true;
      state.loading = action.payload.loading;
      state.user = action.payload.user || null;
    },
    logout: (state: UserState) => {
      state.status = false;
      state.accessToken = null;
      state.user = null;
    },
    refresh: (state: UserState, action: {payload: Payload}) => {
      state.accessToken = action.payload.accessToken;
      state.status = true;
      state.loading = action.payload.loading;
      state.user = action.payload.user || null;
    }
  },
});

export const { login, logout, refresh } = userSlice.actions;

export default userSlice.reducer;
