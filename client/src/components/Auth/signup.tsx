import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectLoading,
  selectErrors,
  removeErrors,
  signup,
} from "../../redux/reducers/authReducer";

import TextFieldGroup from "../common/TextFieldGroup";

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

  const handleSignUp = async (values: SignUpType) => {
    const res = await dispatch(signup(values));

    if (res.type === "auth/signup/fulfilled") {
      toast.configure({
        toastClassName: "toast",
        bodyClassName: "toast-body",
      });

      toast.success("Success", {
        closeButton: true,
      });

      navigate("/signin");
    }
  };

  return (
    <div className="register">
      <ToastContainer />
      <div className="container">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSignUp}
            >
              {({ handleSubmit, handleChange, errors, values }) => (
                <div className="d-grid gap-3">
                  <TextFieldGroup
                    type="text"
                    error={errors.name || server_errors?.name}
                    placeholder="Name"
                    name="name"
                    value={values.name}
                    onChange={(e) => {
                      handleChange(e);

                      dispatch(removeErrors({}));
                    }}
                  />
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
                    info="This site uses Gravatar so if you want a profile image, use
             a Gravatar email"
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
                  <TextFieldGroup
                    type="password"
                    error={errors.password2 || server_errors?.password2}
                    placeholder="Confirm Password"
                    name="password2"
                    value={values.password2}
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
                      "Sign Up"
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

export default SignUp;
