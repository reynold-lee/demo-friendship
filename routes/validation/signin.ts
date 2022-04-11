import validator from "validator";

import isEmpty from "./is-empty";

export default function validateSigninInput(data: {
  email: string;
  password: string;
}) {
  let errors: { email?: string; password?: string; token?: string } = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is require";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
