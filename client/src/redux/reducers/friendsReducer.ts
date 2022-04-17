import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../store";
import { FriendType } from "../../types/Friend";
import { Friend } from "@prisma/client";

// axios set base url
const instance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
  },
});

interface FriendsState {
  loading: boolean;
  friends: FriendType[];
}

const initialState: FriendsState = {
  loading: false,
  friends: [],
};

export const getFriends = createAsyncThunk(
  "friends/getFriends",
  async (request: { id: number }) => {
    try {
      const response = await instance.get("/friends", { params: request });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateFriend = createAsyncThunk(
  "friend/update",
  async (request: Friend) => {
    try {
      const response = await instance.put(
        "friends/friend/" + request.id,
        request
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteFriend = createAsyncThunk(
  "friend/delete",
  async (id: number) => {
    try {
      const response = await instance.delete("friends/friend/" + id.toString());
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
      .addCase(getFriends.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.loading = false;

        state.friends = action.payload;
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateFriend.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateFriend.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.friends.findIndex(
          (friend) => friend.id === action.payload.id
        );

        state.friends[index] = action.payload;
      })
      .addCase(updateFriend.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteFriend.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteFriend.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.friends.findIndex(
          (friend) => friend.id === action.payload.id
        );

        state.friends.splice(index, 1);
      })
      .addCase(deleteFriend.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

const selectState = (state: RootState) => state.friends;

export const selectFriends = createSelector(
  selectState,
  (state) => state.friends
);

export default reducer;
