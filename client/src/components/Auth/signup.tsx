import React from "react";
import * as Mui from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";

import LoadingButton from "@mui/lab/LoadingButton";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectLoading,
  selectErrors,
  removeErrors,
  signup,
} from "../../redux/reducers/authReducer";

import isEmpty from "../../utils/is-empty";

type SignUpType = {
  email: string;
  name: string;
  password: string;
  password2: string;
};

function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectLoading);
  const server_errors = useAppSelector(selectErrors);

  const initialValues: SignUpType = {
    email: "",
    name: "",
    password: "",
    password2: "",
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

  const handleSignUp = React.useCallback(
    async (values: SignUpType) => {
      const resultAction = await dispatch(signup(values));
      if (signup.fulfilled.match(resultAction)) {
        toast.success("Success");
        setTimeout(() => navigate("/signin"), 1000);
      }
    },
    [dispatch, navigate]
  );

  return (
    <div className="register">
      <ToastContainer />
      <Mui.Container className="container" maxWidth="xs">
        <Mui.CssBaseline />
        <Mui.Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Mui.Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <HowToRegOutlinedIcon />
          </Mui.Avatar>
          <Mui.Typography component="h1" variant="h5">
            Sign Up
          </Mui.Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSignUp}
          >
            {({ handleSubmit, handleChange, errors, values, touched }) => (
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
                  label="Email Address"
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

                <LoadingButton
                  onClick={() => handleSubmit()}
                  loadingIndicator="Signuping..."
                  loading={loading}
                  variant="contained"
                  fullWidth
                >
                  Sign Up
                </LoadingButton>
              </Mui.Box>
            )}
          </Formik>
        </Mui.Box>
      </Mui.Container>
    </div>
  );
}

export default SignUp;
