import * as React from "react";
import * as Mui from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUsers, selectUsers } from "../../redux/reducers/usersReducer";

function Summary() {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectUsers);

  const isLoaded = React.useRef(false);

  React.useEffect(() => {
    return () => {
      if (!isLoaded.current) {
        dispatch(getUsers());
        isLoaded.current = true;
      }
    };
  }, [dispatch]);

  return (
    <Mui.Box sx={{ padding: 3 }}>
      <Mui.Grid container spacing={2}>
        {users.map((user) => (
          <Mui.Grid
            key={user.id}
            item
            sm={6}
            md={4}
            xl={3}
            sx={{ width: "100%" }}
          >
            <Mui.Card>
              <Mui.CardHeader
                avatar={
                  <Mui.Avatar
                    alt={user.name}
                    src={user.avatar}
                    aria-label="recipe"
                  ></Mui.Avatar>
                }
                action={
                  <Mui.Chip
                    label={
                      (user._count.friends === 0 ? "No" : user._count.friends) +
                      " friend(s)"
                    }
                    color="primary"
                    variant="outlined"
                  />
                }
                title={user.name}
                subheader={user.email}
              />
            </Mui.Card>
          </Mui.Grid>
        ))}
      </Mui.Grid>
    </Mui.Box>
  );
}

export default Summary;
