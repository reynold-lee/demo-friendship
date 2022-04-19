import * as React from "react";
import * as Mui from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  getFriends,
  selectFriends,
  selectLoading,
  updateFriend,
  deleteFriend,
  removeErrors,
} from "../../redux/reducers/friendsReducer";
import { selectUser } from "../../redux/reducers/authReducer";

import { Gender } from "@prisma/client";
import AddFriend from "../common/addFriend";

function Friends() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const auth = useAppSelector(selectUser);
  const isLoaded = React.useRef<boolean>(false);
  const friends = useAppSelector(selectFriends);
  const [openAddFriend, setOpenAddFriend] = React.useState(false);

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

  const Toolbar = React.useMemo(() => {
    return (
      <GridToolbarContainer>
        <Mui.Button
          color="primary"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddFriend(true)}
        >
          Add Friend
        </Mui.Button>
      </GridToolbarContainer>
    );
  }, []);

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
      setOpenAddFriend(false);
      dispatch(removeErrors({}));
    }
  };

  const columns: GridColDef[] = React.useMemo(() => {
    return [
      { field: "id", headerName: "ID", filterable: false, flex: 1 },
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
        filterable: false,
        valueOptions: [Gender.MALE, Gender.FEMALE],
      },
      {
        field: "age",
        headerName: "Age",
        type: "number",
        flex: 1,
        editable: true,
        filterable: false,
      },
      {
        field: "hobbies",
        headerName: "Hobbies",
        flex: 4,
        editable: true,
        filterable: false,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 4,
        editable: true,
        filterable: false,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        align: "center",
        filterable: false,
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
    return () => {
      if (!isLoaded.current) {
        dispatch(getFriends({ id: auth.id }));
        isLoaded.current = true;
      }
    };
  }, [auth.id, dispatch]);

  return (
    <Mui.Container fixed sx={{ height: "90vh", paddingTop: 1 }}>
      <ToastContainer />
      <DataGrid
        rows={friends}
        columns={columns}
        paginationMode="client"
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        loading={loading}
        checkboxSelection
        disableSelectionOnClick
        components={{ Toolbar: () => Toolbar }}
      />
      <AddFriend
        user_id={auth.id}
        open={openAddFriend}
        handleClose={handleCloseAddFriend}
      />
    </Mui.Container>
  );
}

export default Friends;
