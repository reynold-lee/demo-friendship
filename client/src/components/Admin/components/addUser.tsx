import * as React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Mui from "@mui/material";

import { Role } from "@prisma/client";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectErrors,
  removeErrors,
  addUser,
} from "../../../redux/reducers/usersReducer";

import { ToastContainer, toast } from "react-toastify";

import isEmpty from "../../../utils/is-empty";
import { UserType } from "../../../types/User";

interface AddUserProps {
  open: boolean;
  handleClose: (event: React.SyntheticEvent<unknown>) => void;
}

type AddUserType = Omit<UserType, "id" | "avatar" | "_count"> & {
  password2: string;
};

const initialValues: AddUserType = {
  name: "",
  email: "",
  password: "",
  password2: "",
  role: Role.USER,
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email field is required")
    .email("Invalid Email"),
  name: Yup.string().required("Name field is required"),
  password: Yup.string()
    .required("Password field is required")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must not be greater than 30 characters"),
  password2: Yup.string()
    .required("Confirm password field is required")
    .oneOf([Yup.ref("password"), null], "Passwords must be match"),
});

function AddUser(props: AddUserProps) {
  const dispatch = useAppDispatch();
  const server_errors = useAppSelector(selectErrors);

  const handleAddUser = React.useCallback(
    async (
      values: { name: string; email: string; password: string },
      { resetForm }
    ) => {
      try {
        const resultAction = await dispatch(addUser(values));
        if (addUser.fulfilled.match(resultAction)) {
          toast.success("Success");
          resetForm();
        }
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  return (
    <Mui.Dialog
      maxWidth="xs"
      fullWidth={true}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="responsive-dialog-title"
      disableEscapeKeyDown
    >
      <ToastContainer />
      <Mui.DialogTitle id="responsive-dialog-title">Add User</Mui.DialogTitle>
      <Mui.DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAddUser}
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
                onChange={(e) => {
                  handleChange(e);
                  if (!isEmpty(server_errors)) dispatch(removeErrors({}));
                }}
                error={
                  (touched.name && Boolean(errors.name)) ||
                  !isEmpty(server_errors?.name)
                }
                helperText={
                  (touched.name && errors.name) || server_errors?.name
                }
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

              <Mui.TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="password"
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                  if (!isEmpty(server_errors)) dispatch(removeErrors({}));
                }}
                error={
                  (touched.password && Boolean(errors.password)) ||
                  !isEmpty(server_errors?.password)
                }
                helperText={
                  (touched.password && errors.password) ||
                  server_errors?.password
                }
              />

              <Mui.TextField
                margin="normal"
                required
                fullWidth
                id="password2"
                label="Password2"
                name="password2"
                type="password"
                autoComplete="password2"
                value={values.password2}
                onChange={(e) => {
                  handleChange(e);
                  if (!isEmpty(server_errors)) dispatch(removeErrors({}));
                }}
                error={
                  (touched.password2 && Boolean(errors.password2)) ||
                  !isEmpty(server_errors?.password2)
                }
                helperText={
                  (touched.password2 && errors.password2) ||
                  server_errors?.password2
                }
              />
              <Mui.Stack direction="row" justifyContent="end">
                <Mui.Button
                  onClick={() => {
                    handleSubmit();
                  }}
                  autoFocus
                >
                  Submit
                </Mui.Button>
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

export default AddUser;
