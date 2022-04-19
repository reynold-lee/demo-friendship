import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Friends from "./Friends";
import Profile from "./Profile";

function Dashboard() {
  return (
    <Routes>
      <Route index element={<Friends />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  );
}

export default Dashboard;
