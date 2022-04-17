import * as React from "react";
import * as Mui from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import { ToastContainer, toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getUsers, selectUsers } from "../../redux/reducers/usersReducer";

import { UserType } from "../../types/User";

const columns: GridColDef[] = [
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
    renderCell: (params: GridRenderCellParams<string>) => (
      <Mui.Avatar
        alt="David"
        src={params.value}
        sx={{ width: 24, height: 24 }}
      />
    ),
    flex: 2,
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
        <Mui.IconButton color="primary" aria-label="delete" component="span">
          <GroupIcon />
        </Mui.IconButton>
        <Mui.IconButton color="error" aria-label="delete" component="span">
          <DeleteIcon />
        </Mui.IconButton>
      </div>
    ),
  },
];

function Users() {
  const dispatch = useAppDispatch();

  const users: UserType[] | undefined = useAppSelector(selectUsers);

  React.useEffect(() => {
    return () => {
      dispatch(getUsers());
    };
  }, [dispatch]);

  const processRowUpdate = React.useCallback(async (newRow: GridRowModel) => {
    toast.configure({
      toastClassName: "toast",
      bodyClassName: "toast-body",
    });

    toast.success("Success", {
      closeButton: true,
    });

    console.log("toast");

    return newRow;
  }, []);

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
      />
    </Mui.Container>
  );
}

export default Users;
