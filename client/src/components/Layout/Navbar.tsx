import * as React from "react";
import { useNavigate } from "react-router-dom";
import * as Mui from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  signout,
  selectIsAuthenticated,
  selectUser,
} from "../../redux/reducers/authReducer";
import { selectTotal as selectTotalUsers } from "../../redux/reducers/usersReducer";
import { selectTotal as selectTotalFriends } from "../../redux/reducers/friendsReducer";

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const totalUsers = useAppSelector(selectTotalUsers);
  const totalFriends = useAppSelector(selectTotalFriends);

  const handleSignOut = React.useCallback(() => {
    dispatch(signout({}));
  }, [dispatch]);

  const userLinks = React.useMemo<React.ReactNode>(() => {
    return (
      <Mui.Box
        justifyContent="space-between"
        sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
      >
        <Mui.Button sx={{ my: 2, color: "white", display: "block" }}>
          <Mui.Avatar
            sx={{ width: 24, height: 24 }}
            alt={user?.name}
            src={user?.avatar}
          />
        </Mui.Button>

        <Mui.Stack direction="row" justifyContent="flex-end">
          <Mui.Button
            sx={{ my: 2, color: "white", display: "block" }}
            onClick={() => navigate("dashboard/user/friends")}
          >
            <Mui.Badge color="warning" badgeContent={totalFriends}>
              Friends
            </Mui.Badge>
          </Mui.Button>
          <Mui.Button
            sx={{ my: 2, color: "white", display: "block" }}
            onClick={() => navigate("dashboard/user/profile")}
          >
            Profile
          </Mui.Button>
          <Mui.IconButton
            color="inherit"
            aria-label="menu"
            sx={{ my: 2 }}
            onClick={() => handleSignOut()}
          >
            <ExitToAppIcon />
          </Mui.IconButton>
        </Mui.Stack>
      </Mui.Box>
    );
  }, [handleSignOut, navigate, totalFriends, user?.avatar, user?.name]);

  const adminLinks = React.useMemo(() => {
    return (
      <Mui.Box
        justifyContent="space-between"
        sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
      >
        <Mui.Button sx={{ my: 2, color: "white", display: "block" }}>
          <Mui.Avatar
            sx={{ width: 24, height: 24 }}
            alt={user?.name}
            src={user?.avatar}
          />
        </Mui.Button>

        <Mui.Stack direction="row">
          <Mui.Button
            sx={{ my: 2, color: "white", display: "block" }}
            onClick={() => navigate("dashboard/admin/summary")}
          >
            <Mui.Badge color="warning" badgeContent={totalUsers}>
              Summary
            </Mui.Badge>
          </Mui.Button>
          <Mui.Button
            sx={{ my: 2, color: "white", display: "block" }}
            onClick={() => navigate("dashboard/admin/users")}
          >
            Users
          </Mui.Button>
          <Mui.IconButton
            color="inherit"
            aria-label="menu"
            sx={{ my: 2 }}
            onClick={() => handleSignOut()}
          >
            <ExitToAppIcon />
          </Mui.IconButton>
        </Mui.Stack>
      </Mui.Box>
    );
  }, [handleSignOut, navigate, totalUsers, user?.avatar, user?.name]);

  const guestLinks = React.useMemo<React.ReactNode>(() => {
    return (
      <Mui.Box
        justifyContent="flex-end"
        sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
      >
        <Mui.Button
          sx={{ my: 2, color: "white", display: "block" }}
          onClick={() => navigate("signin")}
        >
          SignIn
        </Mui.Button>
        <Mui.Button
          sx={{ my: 2, color: "white", display: "block" }}
          onClick={() => navigate("signup")}
        >
          SignUp
        </Mui.Button>
      </Mui.Box>
    );
  }, [navigate]);

  return (
    <Mui.AppBar position="static">
      <Mui.Container maxWidth="xl">
        <Mui.Toolbar disableGutters>
          {/* TODO :: Responsive */}
          <Mui.Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            FRIEND
          </Mui.Typography>

          <Mui.Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <Mui.IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-app-bar"
              aria-haspopup="true"
              color="inherit"
            >
              <MenuIcon />
            </Mui.IconButton>
            <Mui.Menu
              id="menu-app-bar"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={false}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <Mui.MenuItem>
                <Mui.Typography textAlign="center">SignIn</Mui.Typography>
              </Mui.MenuItem>
              <Mui.MenuItem>
                <Mui.Typography textAlign="center">SignIn</Mui.Typography>
              </Mui.MenuItem>
            </Mui.Menu>
          </Mui.Box>

          <Mui.Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            Friend
          </Mui.Typography>

          {isAuthenticated
            ? user?.role === "ADMIN"
              ? adminLinks
              : userLinks
            : guestLinks}
        </Mui.Toolbar>
      </Mui.Container>
    </Mui.AppBar>
  );
}

export default Navbar;
