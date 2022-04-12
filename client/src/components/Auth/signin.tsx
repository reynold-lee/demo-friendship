import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  signin,
  selectLoading,
  selectErrors,
  removeErrors,
} from "../../redux/reducers/authReducer";

import TextFieldGroup from "../common/TextFieldGroup";

type SingInType = {
  email: string;
  password: string;
};

function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectLoading);
  const server_errors = useAppSelector(selectErrors);

  const initialValues: SingInType = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email field is required")
      .email("Invalid Email"),
    password: Yup.string()
      .required("Password field is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must not be greater than 30 characters"),
  });

  const handleLogin = React.useCallback(
    async (values: SingInType) => {
      const res = await dispatch(signin(values));

      if (res.type === "auth/signin/fulfilled")
        navigate("/dashboard", { replace: true });
    },
    [dispatch, navigate]
  );

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h1 className="display-4 text-center">Sign In</h1>
            <p className="lead text-center">Sign in to your account</p>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ handleSubmit, handleChange, errors, values }) => (
                <div className="d-grid gap-3">
                  <TextFieldGroup
                    type="email"
                    error={errors.email || server_errors?.email}
                    placeholder="Email Address"
                    name="email"
                    value={values.email}
                    onChange={(e) => {
                      handleChange(e);

                      dispatch(removeErrors({}));
                    }}
                  />
                  <TextFieldGroup
                    type="password"
                    error={errors.password || server_errors?.password}
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    onChange={(e) => {
                      handleChange(e);

                      dispatch(removeErrors({}));
                    }}
                  />

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit as any}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
