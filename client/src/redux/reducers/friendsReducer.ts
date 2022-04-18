import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../store";
import { FriendType } from "../../types/Friend";
import { Friend, Gender } from "@prisma/client";

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
  errors?: {
    email?: string;
  };
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

export const addFriend = createAsyncThunk(
  "friends/addFriend",
  async (
    request: {
      name: string;
      email: string;
      gender: Gender;
      age: number;
      hobbies: string;
      description: string;
      user_id: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post("friends/friend", request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response.data);
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
  reducers: {
    removeErrors(state, action) {
      state.errors = action.payload;
    },
  },
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
      .addCase(addFriend.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.loading = false;

        state.friends.push(action.payload);
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.loading = false;

        state.errors = action.payload as { email?: string };
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

export const selectErrors = createSelector(
  selectState,
  (state) => state.errors
);

export const { removeErrors } = actions;

export default reducer;
