import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

import type { RootState } from "../store";
import { UserType } from "../../types/User";
import setAuthToken from "../../utils/setAuthToken";

// axios set base url
const instance = axios.create({
  baseURL: "http://localhost:5000",
});

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user?: Omit<UserType, "friends" | "password">;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
};

// signin
const signin = createAsyncThunk(
  "auth/signin",
  async (request: { email: string; password: string }) => {
    try {
      const response = await instance.post<{ success: boolean; token: string }>(
        "/signin",
        request
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const { reducer, actions } = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        const { token } = action.payload.data;

        // set token to local storage
        localStorage.setItem("jwtToken", token);

        // set token to auth header
        setAuthToken(token);

        // decode jwt token
        const decoded =
          jwtDecode<Omit<UserType, "password" | "friends">>(token);

        state.user = decoded;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

const selectState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectState,
  (state) => state.isAuthenticated
);

export const selectUser = createSelector(selectState, (state) => state.user);

export default reducer;
