import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "./reducers/authReducer";
import usersReducer from "./reducers/usersReducer";
import friendsReducer from "./reducers/friendsReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    friends: friendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
