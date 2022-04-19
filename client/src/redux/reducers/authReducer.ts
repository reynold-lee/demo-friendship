import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

import { Role } from "@prisma/client";

import type { RootState } from "../store";
import { UserType } from "../../types/User";
import { setAuthToken } from "../../utils/setAuthToken";

type AuthUserType = Omit<UserType, "_count">;
interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  isVerifying: boolean;
  user: AuthUserType;
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
  isVerifying: true,
  user: {
    id: 0,
    name: "",
    email: "",
    avatar: "",
    password: "",
    role: Role.USER,
  },
};

// signin
export const signin = createAsyncThunk(
  "auth/signin",
  async (
    request: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axios.post<{ success: boolean; token: string }>(
        "/signin",
        request
      );

      const { token } = response.data;
      // set token to local storage
      localStorage.setItem("jwtToken", token);

      await dispatch(verify());

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
      const response = await axios.post("/signup", request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response.data);
    }
  }
);

// verify token
export const verify = createAsyncThunk("auth/verify", async () => {
  try {
    const response = await axios.post("/verify", {
      token: localStorage.getItem("jwtToken"),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const { reducer, actions } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout(state): void {
      // remove token from local storage
      localStorage.removeItem("jwtToken");
      state.isAuthenticated = false;
      state.user = {} as AuthUserType;
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
      })
      .addCase(verify.pending, (state, action) => {
        state.isVerifying = true;
      })
      .addCase(verify.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.isAuthenticated = true;
        state.user = action.payload as AuthUserType;

        setAuthToken(localStorage.getItem("jwtToken"));
      })
      .addCase(verify.rejected, (state, action) => {
        state.isVerifying = false;
        state.isAuthenticated = false;
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

export const selectIsVerifying = createSelector(
  selectState,
  (state) => state.isVerifying
);

export const { signout, removeErrors } = actions;

export default reducer;
