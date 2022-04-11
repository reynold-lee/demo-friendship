import validator from "validator";

import isEmpty from "./is-empty";

export default function validateSignupInput(data: {
  name: string;
  email: string;
  password: string;
  password2: string;
}) {
  let errors: {
    name?: string;
    email?: string;
    password?: string;
    password2?: string;
  } = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name shoould have 2 to 30 characters";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password should be min 6 characters";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirmed Password field is required";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords should match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}
