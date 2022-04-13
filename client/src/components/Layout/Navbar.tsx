import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  signout,
  selectIsAuthenticated,
  selectUser,
} from "../../redux/reducers/authReducer";

function Navbar() {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const handleSignOut = React.useCallback(() => {
    dispatch(signout({}));
  }, [dispatch]);

  const userLinks = React.useMemo<React.ReactNode>(() => {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/feed">
            Post Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard/user">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Button
            variant="link"
            className="nav-link"
            onClick={() => handleSignOut()}
          >
            <img
              src={user?.avatar}
              className="rounded-circle"
              alt={user?.name}
              style={{ width: "25px", marginRight: "5px" }}
              title="You must have a Gravatar to display"
            />
            Sign Out
          </Button>
        </li>
      </ul>
    );
  }, [handleSignOut, user?.avatar, user?.name]);

  const adminLinks = React.useMemo(() => {
    return (
      <div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="dashboard/admin/users">
              Users
            </Link>
          </li>
          <li className="nav-item">
            <Button
              variant="link"
              className="nav-link"
              onClick={() => handleSignOut()}
            >
              <img
                src={user?.avatar}
                className="rounded-circle"
                alt={user?.name}
                style={{ width: "25px", marginRight: "5px" }}
                title="You must have a Gravatar to display"
              />
              Sign Out
            </Button>
          </li>
        </ul>
      </div>
    );
  }, [handleSignOut, user?.avatar, user?.name]);

  const guestLinks = React.useMemo<React.ReactNode>(() => {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/signin">
            Sign In
          </Link>
        </li>
      </ul>
    );
  }, []);

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Friend
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mobile-nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="mobile-nav"
        >
          {isAuthenticated
            ? user?.role === "ADMIN"
              ? adminLinks
              : userLinks
            : guestLinks}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
