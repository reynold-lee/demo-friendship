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
      .addCase(getUsers.rejected, (state, action) => {});
  },
});

const selectState = (state: RootState) => state.users;

export const selectUsers = createSelector(selectState, (state) => state.users);

export default reducer;
