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
import isEmpty from "../../utils/is-empty";

// axios set base url
const instance = axios.create({
  baseURL: "http://localhost:5000",
});
interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user?: Omit<UserType, "friends" | "password">;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    password2?: string;
  };
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
};

// signin
export const signin = createAsyncThunk(
  "auth/signin",
  async (request: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await instance.post<{ success: boolean; token: string }>(
        "/signin",
        request
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response.data);
    }
  }
);

// signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    request: {
      name: string;
      email: string;
      password: string;
      password2: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post("/signup", request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response.dat);
    }
  }
);

export const { reducer, actions } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout(state, action): void {
      // remove token from local storage
      localStorage.removeItem("jwtToken");

      setAuthToken("");

      state.isAuthenticated = false;
      state.user = action.payload;
    },
    setCurrentUser(state, action): void {
      state.user = action.payload;

      if (!isEmpty(action.payload)) {
        state.isAuthenticated = true;
      }
    },
    removeErrors(state, action) {
      state.errors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;

        const { token } = action.payload;

        // set token to local storage
        localStorage.setItem("jwtToken", token);

        // set token to auth header
        setAuthToken(token);

        // decode jwt token
        const decoded =
          jwtDecode<Omit<UserType, "friends" | "password">>(token);

        state.isAuthenticated = true;
        state.user = decoded;
        state.errors = {};
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload as { email?: string; password?: string };
      })
      .addCase(signup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload as {
          name?: string;
          email?: string;
          password?: string;
          password2?: string;
        };
      });
  },
});

const selectState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  selectState,
  (state) => state.isAuthenticated
);

export const selectUser = createSelector(selectState, (state) => state.user);

export const selectErrors = createSelector(
  selectState,
  (state) => state.errors
);

export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);

export const { setCurrentUser, signout, removeErrors } = actions;

export default reducer;
