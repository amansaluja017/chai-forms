import { createSlice } from "@reduxjs/toolkit";

type UserState = {
  accessToken?: string | null;
  status: boolean;
  loading: boolean;
};

type Payload = {
  accessToken?: string | null;
  loading: boolean;
};

const initialState: UserState = { status: false, accessToken: null, loading: true };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state: UserState, action: {payload: Payload}) => {
      state.accessToken = action.payload.accessToken;
      state.status = true;
      state.loading = action.payload.loading;
    },
    logout: (state: UserState) => {
      state.status = false;
      state.accessToken = null;
    },
    refresh: (state: UserState, action: {payload: Payload}) => {
      state.accessToken = action.payload.accessToken;
      state.status = true;
      state.loading = action.payload.loading;
    }
  },
});

export const { login, logout, refresh } = userSlice.actions;

export default userSlice.reducer;
