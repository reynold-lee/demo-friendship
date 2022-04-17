import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Users from "./users";
import Summary from "./summary";

function Admin() {
  return (
    <Routes>
      <Route index element={<Summary />} />
      <Route path="/users" element={<Users />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  );
}

export default Admin;
