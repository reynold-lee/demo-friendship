import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spinner } from "react-bootstrap";

import Navbar from "./components/Layout/Navbar";
import SignIn from "./components/Auth/signin";
import SignUp from "./components/Auth/signup";
import { PrivateRoute } from "./components/common/PrivateRoute";
import Dashboard from "./components/Dashboard/dashboard";
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
    dispatch(verify());
  }, [dispatch]);

  return isVerifying ? (
    <Spinner animation="grow" />
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
          {currentUser?.role === "ADMIN" ? (
            <Route path="admin/*" element={<Admin />} />
          ) : (
            <Route>
              <Route path="" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="" />} />
            </Route>
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
