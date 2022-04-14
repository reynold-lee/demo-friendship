import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../../redux/hooks";
import { selectIsAuthenticated } from "../../redux/reducers/authReducer";

export const PrivateRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};
