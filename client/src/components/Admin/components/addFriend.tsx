import * as React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Mui from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  addFriend,
  selectErrors,
  removeErrors,
} from "../../../redux/reducers/friendsReducer";

import { ToastContainer, toast } from "react-toastify";

import isEmpty from "../../../utils/is-empty";
import { FriendType } from "../../../types/Friend";
import { Gender } from "@prisma/client";

type AddFriendType = Omit<FriendType, "id">;

const initialValues: AddFriendType = {
  name: "",
  email: "",
  gender: Gender.MALE,
  age: 1,
  hobbies: "",
  description: "",
  user_id: 0,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name field is required"),
  email: Yup.string()
    .required("Email field is required")
    .email("Invalid Email"),
  hobbies: Yup.string().required("Hobbies field is required"),
  description: Yup.string().required("Description field is required"),
});

interface AddFriendProps {
  user_id: number;
  open: boolean;
  handleClose: (event: React.SyntheticEvent<unknown>) => void;
}

function AddFriend(props: AddFriendProps) {
  const dispatch = useAppDispatch();

  const [gender, setGender] = React.useState<Gender>(Gender.MALE);
  const server_errors = useAppSelector(selectErrors);

  const handleChangeGender = (e: Mui.SelectChangeEvent) => {
    setGender(e.target.value as Gender);
  };

  const handleAddFriend = React.useCallback(
    async (values: AddFriendType, { resetForm }) => {
      try {
        values.user_id = props.user_id;

        const resultAction = await dispatch(addFriend(values));
        if (addFriend.fulfilled.match(resultAction)) {
          toast.success("Success");
          resetForm();
        }
      } catch (error) {
        throw error;
      }
    },
    [dispatch, props.user_id]
  );

  return (
    <Mui.Dialog
      maxWidth="xs"
      fullWidth
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
      disableEscapeKeyDown
    >
      <ToastContainer />
      <Mui.DialogTitle id="responsive-dialog-title">Friends</Mui.DialogTitle>
      <Mui.DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAddFriend}
        >
          {({
            handleSubmit,
            handleChange,
            resetForm,
            values,
            errors,
            touched,
          }) => (
            <Mui.Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Mui.TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Mui.TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => {
                  handleChange(e);
                  if (!isEmpty(server_errors)) dispatch(removeErrors({}));
                }}
                error={
                  (touched.email && Boolean(errors.email)) ||
                  !isEmpty(server_errors?.email)
                }
                helperText={
                  (touched.email && errors.email) || server_errors?.email
                }
              />
              <Mui.FormControl margin="normal" fullWidth>
                <Mui.InputLabel id="demo-simple-select-label">
                  Gender
                </Mui.InputLabel>
                <Mui.Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  label="Gender"
                  onChange={handleChangeGender}
                >
                  <Mui.MenuItem value={Gender.MALE}>{Gender.MALE}</Mui.MenuItem>
                  <Mui.MenuItem value={Gender.FEMALE}>
                    {Gender.FEMALE}
                  </Mui.MenuItem>
                </Mui.Select>
              </Mui.FormControl>
              <Mui.TextField
                margin="normal"
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                type="number"
                inputProps={{ min: 1, max: 150 }}
                autoComplete="age"
                value={values.age}
                onChange={handleChange}
                error={touched.age && Boolean(errors.age)}
                helperText={touched.age && errors.age}
              />
              <Mui.TextField
                margin="normal"
                required
                fullWidth
                id="hobbies"
                label="Hobbies"
                name="hobbies"
                autoComplete="hobbies"
                value={values.hobbies}
                onChange={handleChange}
                error={touched.hobbies && Boolean(errors.hobbies)}
                helperText={touched.hobbies && errors.hobbies}
              />
              <Mui.TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="description"
                name="description"
                multiline={true}
                rows={3}
                autoComplete="description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />

              <Mui.Stack direction="row" justifyContent="end">
                <Mui.Button onClick={() => handleSubmit()}>Submit</Mui.Button>
                <Mui.Button onClick={props.handleClose} autoFocus>
                  Cancel
                </Mui.Button>
              </Mui.Stack>
            </Mui.Box>
          )}
        </Formik>
      </Mui.DialogContent>
    </Mui.Dialog>
  );
}

export default AddFriend;
