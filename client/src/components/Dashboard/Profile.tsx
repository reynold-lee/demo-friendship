import * as React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Mui from "@mui/material";
import { IconButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/reducers/authReducer";
import {
  selectFriends,
  getFriends,
  selectTotal,
} from "../../redux/reducers/friendsReducer";
import {
  selectErrors,
  removeErrors,
  updateUser,
} from "../../redux/reducers/usersReducer";

import { ToastContainer, toast } from "react-toastify";

import isEmpty from "../../utils/is-empty";
import { UserType } from "../../types/User";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <Mui.IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

type AddUserType = Omit<UserType, "id" | "avatar" | "_count"> & {
  password2: string;
};

function Profile() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectUser);
  const friends = useAppSelector(selectFriends);
  const total = useAppSelector(selectTotal);
  const server_errors = useAppSelector(selectErrors);

  const [expanded, setExpanded] = React.useState(true);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const isLoaded = React.useRef(false);

  const initialValues: AddUserType = React.useMemo(() => {
    return {
      name: auth.name,
      email: auth.email,
      password: "",
      password2: "",
      role: auth.role,
    };
  }, [auth.email, auth.name, auth.role]);

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

  const isMutation = React.useCallback(
    (values: { name: string; email: string; password: string }) => {
      if (initialValues.name !== values.name) return true;
      if (initialValues.email !== values.email) return true;
      if (initialValues.password !== values.password) return true;
      return false;
    },
    [initialValues.email, initialValues.name, initialValues.password]
  );

  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = (name: string) => {
    let children = "";
    if (name.indexOf(" ") === -1) {
      children = name[0].toUpperCase();
    } else {
      children = `${name.split(" ")[0][0].toUpperCase()}${name
        .split(" ")[1][0]
        .toUpperCase()}`;
    }
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: children,
    };
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleUpdateUser = React.useCallback(
    async (
      values: { name: string; email: string; password: string },
      { resetForm }
    ) => {
      try {
        // is mutation?
        if (isMutation(values)) {
          const resultAction = await dispatch(
            updateUser({
              id: auth.id,
              email: values.email,
              name: values.name,
              password: values.password,
            })
          );

          if (updateUser.fulfilled.match(resultAction)) {
            toast.success("Success");
            setIsEditMode(false);
          }
        } else {
          toast.warning("No fields have been updated");
        }
      } catch (error) {
        throw error;
      }
    },
    [auth.id, dispatch, isMutation]
  );

  React.useEffect(() => {
    return () => {
      if (!isLoaded.current) {
        dispatch(getFriends({ id: auth.id }));
        isLoaded.current = true;
      }
    };
  }, [auth.id, dispatch]);

  return (
    <Mui.Card sx={{ padding: 3, margin: 3, width: "50%", marginX: "auto" }}>
      <ToastContainer />
      <Mui.CardHeader
        avatar={
          <Mui.Avatar
            alt={auth.name}
            src={auth.avatar}
            aria-label="recipe"
          ></Mui.Avatar>
        }
        action={
          <Mui.Chip
            label={(total === 0 ? "No" : total) + " friend(s)"}
            color="primary"
            variant="outlined"
          />
        }
        title={auth.name}
        subheader={auth.email}
      />
      <Mui.CardMedia component="div" sx={{ width: "80%", marginX: "auto" }}>
        <Mui.Grid container spacing={2}>
          {friends.map((friend) => (
            <Mui.Grid key={friend.id} item xs={1} sx={{ width: "100%" }}>
              <Mui.Avatar {...stringAvatar(friend.name)} />
            </Mui.Grid>
          ))}
        </Mui.Grid>
      </Mui.CardMedia>
      <Mui.CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Mui.CardActions>
      <Mui.Collapse in={expanded} timeout="auto" unmountOnExit>
        <Mui.CardContent>
          <Mui.Typography paragraph>Profile:</Mui.Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleUpdateUser}
          >
            {({
              handleSubmit,
              handleChange,
              resetForm,
              values,
              errors,
              touched,
            }) => (
              <Mui.Box>
                <Mui.TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  InputProps={{ readOnly: !isEditMode }}
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
                  InputProps={{ readOnly: !isEditMode }}
                />
                <Mui.TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  value={isEditMode ? values.password : auth.password}
                  autoComplete="password"
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{ readOnly: !isEditMode }}
                />

                {isEditMode && (
                  <Mui.TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password2"
                    label="Confirm Password"
                    name="password2"
                    type="password"
                    value={values.password2}
                    autoComplete="password2"
                    onChange={handleChange}
                    error={touched.password2 && Boolean(errors.password2)}
                    helperText={touched.password2 && errors.password2}
                    InputProps={{ readOnly: !isEditMode }}
                  />
                )}

                <Mui.Stack direction="row" justifyContent="end">
                  {isEditMode ? (
                    <Mui.Box>
                      <Mui.Button onClick={() => handleSubmit()}>
                        Save
                      </Mui.Button>
                      <Mui.Button
                        onClick={() => {
                          setIsEditMode(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Mui.Button>
                    </Mui.Box>
                  ) : (
                    <Mui.Box>
                      <Mui.Button onClick={() => setIsEditMode(true)}>
                        Edit
                      </Mui.Button>
                    </Mui.Box>
                  )}
                </Mui.Stack>
              </Mui.Box>
            )}
          </Formik>
        </Mui.CardContent>
      </Mui.Collapse>
    </Mui.Card>
  );
}

export default Profile;
