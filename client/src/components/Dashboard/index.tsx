import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// import { useAppDispatch } from "../../redux/hooks";
// import { signout } from "../../redux/reducers/authReducer";

import Profile from "./Profile";
import Friends from "./Friends";

function Dashboard() {
  return (
    <Routes>
      <Route index element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  );
}

export default Dashboard;
