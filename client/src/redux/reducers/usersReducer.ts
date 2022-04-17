import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../store";
import { UserType } from "../../types/User";

// axios set base url
const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
  },
});

interface UsersState {
  loading: boolean;
  users: UserType[];
}

const initialState: UsersState = {
  loading: false,
  users: [],
};

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  try {
    const response = await instance.get<UserType[]>("/users");
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const updateUser = createAsyncThunk(
  "user/update",
  async (request: { id: number; email?: string; name?: string }) => {
    try {
      const response = await instance.put(
        "users/user/" + request.id.toString(),
        {
          email: request.email,
          name: request.name,
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetpassword",
  async (request: { id: number }) => {
    try {
      const response = await instance.put(
        "users/user/" + request.id.toString() + "/resetpassword"
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (request: { id: number }) => {
    try {
      const response = await instance.delete(
        "users/user/" + request.id.toString()
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const { reducer, actions } = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );

        state.users[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );

        state.users[index] = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );

        state.users.splice(index, 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

const selectState = (state: RootState) => state.users;

export const selectUsers = createSelector(selectState, (state) => state.users);

export const selectLoading = createSelector(
  selectState,
  (state) => state.loading
);

export default reducer;
