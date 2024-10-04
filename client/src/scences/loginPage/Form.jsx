import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";

import { setLogin } from "../../state";
import FlexBetween from "../../components/FlexBetween";
import { AssignmentReturn } from "@mui/icons-material";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("Invalid email").required("required"),
  password: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialRegisterValue = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  picture: "",
};

const initialLoginValue = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setpageType] = useState("login");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const [loading, setLoading] = useState(false);
  // REGISTER
  const register = async (values, onSubmitProps) => {
    setLoading(true);
    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }

    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/auth/register`,

      {
        method: "POST",
        body: formData,
      }
    );

    setLoading(false);
    if (!savedUserResponse.ok) {
      onSubmitProps.setFieldError("email", "Email already exits");
      return;
    }

    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setpageType("login");
    }
  };

  //  LOGIN
  const login = async (values, onSubmitProps) => {
    setLoading(true);

    const loggedInResponse = await fetch(
      `
        ${import.meta.env.VITE_REACT_API_URL}/auth/login
        `,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    setLoading(false);
    if (!loggedInResponse.ok) {
      const err = await loggedInResponse.json();
      if (err.msg == "Invalid email") {
        onSubmitProps.setFieldError("email", "Provide valid email");
        return;
      }
      if (err.msg == "Invalid Password") {
        onSubmitProps.setFieldError("password", "Provide valid password");
        return;
      }
    }

    const loggedUser = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedUser) {
      dispatch(
        setLogin({
          user: loggedUser.user,
          token: loggedUser.token,
        })
      );

      navigate("/home");
    }
  };

  const handleSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={isLogin ? initialLoginValue : initialRegisterValue}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
              },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{
                    gridColumn: "span 2",
                  }}
                />

                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{
                    gridColumn: "span 2",
                  }}
                />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.netural.mediumMain}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => {
                      setFieldValue("picture", acceptedFiles[0]);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.dark}`}
                        p="1rem"
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{
                gridColumn: "span 4",
              }}
            />

            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{
                gridColumn: "span 4",
              }}
            />
          </Box>

          <Box>
            <Button
              fullWidth
              type="submit"
              disabled={loading}
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.dark,
                color: palette.background.alt,
                "&:hover": { backgroundColor: palette.primary.main },
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isLogin ? (
                "LOGIN"
              ) : (
                "REGISTER"
              )}
            </Button>
            <Typography
              onClick={() => {
                setpageType(isLogin ? "register" : "login");

                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.dark,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.main,
                },
              }}
            >
              {isLogin
                ? "Don't Have an Account ? Sign Up Here"
                : "Already have and Account ? Login Here"}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};
export default Form;
