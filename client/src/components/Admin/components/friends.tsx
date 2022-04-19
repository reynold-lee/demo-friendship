import * as React from "react";
import * as Mui from "@mui/material";

import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectFriends,
  getFriends,
  updateFriend,
  deleteFriend,
  removeErrors,
} from "../../../redux/reducers/friendsReducer";

import { Friend, Gender } from "@prisma/client";
import AddFriend from "../../common/addFriend";

interface FriendsProps {
  user_id: number;
  open: boolean;
  handleClose: (event: React.SyntheticEvent<unknown>) => void;
}

function Friends(props: FriendsProps) {
  const dispatch = useAppDispatch();
  const friends = useAppSelector(selectFriends);
  const [isAddFriendOpen, setIsAddFriendOpen] = React.useState(false);

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
          const resultAction = await dispatch(updateFriend(newRow));
          if (updateFriend.fulfilled.match(resultAction))
            toast.success("Success");
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
        Swal.fire({
          title: "Delete Friend",
          text: "Are u really delete?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete friend",
        }).then(async (result) => {
          if (result.value) {
            const resultAction = await dispatch(deleteFriend(id));
            if (deleteFriend.fulfilled.match(resultAction))
              toast.success("Success");
          }
        });
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const handleCloseAddFriend = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") {
      setIsAddFriendOpen(false);
      dispatch(removeErrors({}));
    }
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
      <Mui.DialogTitle
        id="responsive-dialog-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        Friends
        <Mui.Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddFriendOpen(true)}
        >
          Add Friend
        </Mui.Button>
      </Mui.DialogTitle>
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
      <AddFriend
        user_id={props.user_id}
        open={isAddFriendOpen}
        handleClose={handleCloseAddFriend}
      />
    </Mui.Dialog>
  );
}

export default Friends;
