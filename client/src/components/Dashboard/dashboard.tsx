import * as React from "react";

import { useAppDispatch } from "../../redux/hooks";
import { signout } from "../../redux/reducers/authReducer";

function Dashboard() {
  const dispatch = useAppDispatch();
  const handleSignout = () => {
    dispatch(signout({}));
  };

  return (
    <div>
      Dashboard <button onClick={handleSignout}>Sign Out</button>{" "}
    </div>
  );
}

export default Dashboard;
