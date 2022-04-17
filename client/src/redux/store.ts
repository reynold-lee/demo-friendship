import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "./reducers/authReducer";
import usersReducer from "./reducers/usersReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
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
