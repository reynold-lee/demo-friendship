import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import * as Mui from "@mui/material";

import Navbar from "./components/Layout/Navbar";
import SignIn from "./components/Auth/signin";
import SignUp from "./components/Auth/signup";
import { PrivateRoute } from "./components/common/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Admin from "./components/Admin";

import { useAppSelector, useAppDispatch } from "./redux/hooks";
import {
  selectIsAuthenticated,
  selectIsVerifying,
  selectUser,
  verify,
} from "./redux/reducers/authReducer";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useAppDispatch();
  const isVerifying = useAppSelector(selectIsVerifying);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectUser);

  React.useEffect(() => {
    return () => {
      dispatch(verify());
    };
  }, [dispatch]);

  return isVerifying ? (
    <Mui.CircularProgress />
  ) : (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />}
        />

        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route
            index
            element={
              currentUser?.role === "ADMIN" ? (
                <Navigate to="admin" />
              ) : (
                <Navigate to="user" />
              )
            }
          />
          {currentUser?.role === "ADMIN" ? (
            <Route>
              <Route path="admin/*" element={<Admin />} />
            </Route>
          ) : (
            <Route>
              <Route path="user/*" element={<Dashboard />} />
            </Route>
          )}
        </Route>
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
