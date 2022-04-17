import * as React from "react";
import * as Mui from "@mui/material";

import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";

import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectFriends,
  getFriends,
  updateFriend,
  deleteFriend,
} from "../../../redux/reducers/friendsReducer";
import { Friend, Gender } from "@prisma/client";

interface FriendsProps {
  user_id: number;
  open: boolean;
  handleClose: (event: React.SyntheticEvent<unknown>) => void;
}

function Friends(props: FriendsProps) {
  const dispatch = useAppDispatch();
  const friends = useAppSelector(selectFriends);

  const theme = Mui.useTheme();
  const fullScreen = Mui.useMediaQuery(theme.breakpoints.down("md"));

  const isMutation = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) => {
      if (newRow.name !== oldRow.name) return true;
      if (newRow.email !== oldRow.email) return true;
      if (newRow.gender !== oldRow.gender) return true;
      if (newRow.age !== oldRow.age) return true;
      if (newRow.hobbies !== oldRow.hobbies) return true;
      if (newRow.description !== oldRow.description) return true;
      return false;
    },
    []
  );

  const processRowUpdate = React.useCallback(
    async (newRow: GridRowModel, oldRow: GridRowModel) => {
      if (isMutation(newRow, oldRow))
        try {
          await toast.promise(dispatch(updateFriend(newRow)), {
            pending: "Updating...",
            success: "Success",
            error: "Failed",
          });
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
        await toast.promise(dispatch(deleteFriend(id)), {
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
        field: "gender",
        headerName: "Gender",
        type: "singleSelect",
        flex: 1,
        editable: true,
        valueOptions: [Gender.MALE, Gender.FEMALE],
      },
      {
        field: "age",
        headerName: "Age",
        type: "number",
        flex: 1,
        editable: true,
      },
      {
        field: "hobbies",
        headerName: "Hobbies",
        flex: 4,
        editable: true,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 4,
        editable: true,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        align: "center",
        renderCell: (params: GridRenderCellParams) => (
          <Mui.IconButton
            color="error"
            aria-label="delete"
            component="span"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </Mui.IconButton>
        ),
      },
    ];
  }, [handleDelete]);

  React.useEffect(() => {
    if (props.open) dispatch(getFriends({ id: props.user_id }));
  }, [dispatch, props.open, props.user_id]);

  return (
    <Mui.Dialog
      fullScreen={fullScreen}
      maxWidth="xl"
      fullWidth={true}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
      disableEscapeKeyDown
    >
      <Mui.DialogTitle id="responsive-dialog-title">Friends</Mui.DialogTitle>
      <Mui.DialogContent sx={{ height: "50vh" }}>
        <DataGrid
          rows={friends as Omit<Friend, "user_id">[]}
          columns={columns}
          paginationMode="client"
          processRowUpdate={processRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          checkboxSelection
          disableSelectionOnClick
        />
      </Mui.DialogContent>
      <Mui.DialogActions>
        <Mui.Button onClick={props.handleClose} autoFocus>
          Cancel
        </Mui.Button>
      </Mui.DialogActions>
    </Mui.Dialog>
  );
}

export default Friends;
