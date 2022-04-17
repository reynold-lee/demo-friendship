import * as React from "react";
import * as Mui from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
  GridToolbarContainer,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";

import { ToastContainer, toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getUsers,
  selectUsers,
  updateUser,
  resetPassword,
  deleteUser,
} from "../../redux/reducers/usersReducer";

import Friends from "./components/friends";
import { UserType } from "../../types/User";
import AddUser from "./components/addUser";

function Users() {
  const dispatch = useAppDispatch();

  const [openFriends, setOpenFriends] = React.useState(false);
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [userId, setUserId] = React.useState(0);
  const users: UserType[] | undefined = useAppSelector(selectUsers);

  const isMutation = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) => {
      if (newRow.name !== oldRow.name) return true;
      if (newRow.email !== oldRow.email) return true;
      return false;
    },
    []
  );

  const Toolbar = React.useMemo(() => {
    return (
      <GridToolbarContainer>
        <Mui.Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddUser(true)}
        >
          Add User
        </Mui.Button>
      </GridToolbarContainer>
    );
  }, []);

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel, oldRow: GridRowModel) => {
      if (isMutation(newRow, oldRow))
        try {
          await toast.promise(
            dispatch(
              updateUser({
                id: newRow.id,
                email: newRow.email,
                name: newRow.name,
              })
            ),
            {
              pending: "Updating...",
              success: "Success",
              error: "Failed",
            }
          );

          return newRow;
        } catch (error) {
          throw error;
        }

      return oldRow;
    },
    [dispatch, isMutation]
  );

  const handleDelete = React.useCallback(
    async (id: number) => {
      try {
        await toast.promise(dispatch(deleteUser(id)), {
          pending: "Deleting...",
          success: "Success",
          error: "Failed",
        });
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleResetPassword = React.useCallback(
    async (id: number) => {
      try {
        await toast.promise(dispatch(resetPassword(id)), {
          pending: "Resetting password...",
          success: "Success",
          error: "Failed",
        });
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleCloseFriends = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") setOpenFriends(false);
  };
  const handleCloseAddUser = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") setOpenAddUser(false);
  };

  const columns: GridColDef[] = React.useMemo(() => {
    return [
      { field: "id", headerName: "ID", flex: 1 },
      {
        field: "email",
        headerName: "Email",
        flex: 2,
        editable: true,
      },
      {
        field: "name",
        headerName: "Name",
        flex: 2,
        editable: true,
      },
      {
        field: "avatar",
        headerName: "Avatar",
        align: "center",
        renderCell: (params: GridRenderCellParams<string>) => (
          <Mui.Avatar
            alt="David"
            src={params.value}
            sx={{ width: 24, height: 24 }}
          />
        ),
        flex: 1,
      },
      {
        field: "password",
        headerName: "Password",
        flex: 3,
        sortable: false,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          return "*".repeat(params.value.length);
        },
      },
      {
        field: "role",
        headerName: "Role",
        flex: 1,
        sortable: true,
      },
      {
        field: "action",
        headerName: "Actions",
        flex: 2,
        align: "center",
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <div>
            <Mui.IconButton
              color="primary"
              aria-label="friends"
              component="span"
              onClick={() => {
                setUserId(params.row.id);
                setOpenFriends(true);
              }}
            >
              <GroupIcon />
            </Mui.IconButton>
            <Mui.IconButton
              color="info"
              aria-label="delete-password"
              component="span"
              onClick={() => handleResetPassword(params.row.id)}
            >
              <LockResetRoundedIcon />
            </Mui.IconButton>
            <Mui.IconButton
              color="error"
              aria-label="delete"
              component="span"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </Mui.IconButton>
          </div>
        ),
      },
    ];
  }, [handleDelete, handleResetPassword]);

  React.useEffect(() => {
    return () => {
      dispatch(getUsers());
    };
  }, [dispatch]);

  return (
    <Mui.Container fixed sx={{ height: "90vh", paddingTop: 1 }}>
      <ToastContainer />
      <DataGrid
        rows={users}
        columns={columns}
        paginationMode="client"
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        checkboxSelection
        disableSelectionOnClick
        components={{ Toolbar: () => Toolbar }}
      />
      <Friends
        user_id={userId}
        open={openFriends}
        handleClose={handleCloseFriends}
      />
      <AddUser open={openAddUser} handleClose={handleCloseAddUser} />
    </Mui.Container>
  );
}

export default Users;
