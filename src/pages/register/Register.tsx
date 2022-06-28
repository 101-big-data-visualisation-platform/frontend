import React, { useContext, useState } from "react";
import { ThemeContext } from "styled-components";
import Mountains from "../../svg/mountains/Mountains";
import {
  InputLabel,
  LinkButton,
  RegisterButton,
  RegisterHeader,
  LoginLinkButton,
  StyledArrowBackIcon,
  StyledDiv1,
  StyledDiv2,
  StyledDiv3,
  StyledDiv4,
  StyledDiv5,
  StyledDiv6,
  StyledForm,
  StyledH1,
  StyledIconButton,
  StyledInput,
  StyledP,
} from "./styled";
import { Formik } from "formik";
import { Alert, AlertTitle, LinearProgress } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const theme = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleMouseDownPassword = (event: {
    preventDefault: () => void;
  }): void => {
    event.preventDefault();
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <StyledDiv1>
      <StyledDiv2>
        <LinkButton to="/">
          <StyledArrowBackIcon /> Homepage
        </LinkButton>
        <StyledDiv3>
          <StyledDiv4>
            <RegisterHeader>Register</RegisterHeader>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={{
                username: "",
                password: "",
                email: "",
              }}
              validate={(values): Object => {
                type Errors = {
                  username: string;
                  password: string;
                  email: string;
                };
                const errors: Errors = {
                  username: "",
                  password: "",
                  email: "",
                };

                if (!values.username) {
                  errors.username = "Required";
                }
                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid Email";
                }
                if (!values.password) {
                  errors.password = "Required";
                }

                if (
                  errors.email.length > 0 ||
                  errors.username.length > 0 ||
                  errors.password.length > 0
                ) {
                  return errors;
                } else {
                  return {};
                }
              }}
              onSubmit={async (values, { setSubmitting }): Promise<void> => {
                setLoggedIn(false);

                try {
                  const { user } = await Auth.signUp({
                    username: values.username,
                    password: values.password,
                    attributes: {
                      email: values.email, // optional
                    },
                  });
                  alert(JSON.stringify(user, null, 2));
                  setRegisterError(false);
                  setSubmitting(false);
                  setLoggedIn(true);
                } catch (error) {
                  setRegisterError(true);
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <StyledForm onSubmit={handleSubmit}>
                  <InputLabel>
                    Username{" "}
                    <span style={{ color: "orange" }}>
                      {errors.username && touched.username && errors.username}
                    </span>
                  </InputLabel>
                  <StyledInput
                    type="text"
                    name="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                  />
                  <InputLabel>
                    Email{" "}
                    <span style={{ color: "orange" }}>
                      {errors.email && touched.email && errors.email}
                    </span>
                  </InputLabel>
                  <StyledInput
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <InputLabel>
                    Password{" "}
                    <span style={{ color: "orange" }}>
                      {errors.password && touched.password && errors.password}
                    </span>
                  </InputLabel>
                  <StyledInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <StyledIconButton
                          aria-label="toggle password visibility"
                          name="showPassword"
                          onClick={togglePasswordVisibility}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </StyledIconButton>
                      </InputAdornment>
                    }
                  />
                  <StyledDiv6>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: 0,
                          fontSize: "0.8rem",
                        }}
                      >
                        remember me
                      </p>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{ marginLeft: "10px" }}
                      />
                    </div>
                    <RegisterButton type="submit" disabled={isSubmitting}>
                      Register
                    </RegisterButton>
                  </StyledDiv6>
                  {registerError && (
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      You were unable to register because this username and
                      email were already taken.
                    </Alert>
                  )}
                  {isSubmitting && (
                    <Alert severity="info">
                      <AlertTitle>Registering</AlertTitle>
                      We are registering your credentials.
                      <LinearProgress
                        color="primary"
                        style={{
                          marginTop: "10px",
                        }}
                      />
                    </Alert>
                  )}
                  {loggedIn && (
                    <Alert severity="success">
                      <AlertTitle>Success</AlertTitle>
                      You must now verify your account from your email. Click{" "}
                      <Link to="/verify">here</Link> to be redirected to the
                      verification page.
                    </Alert>
                  )}
                </StyledForm>
              )}
            </Formik>
          </StyledDiv4>
          <StyledDiv4>
            <StyledDiv5>
              <StyledH1>Hello There!</StyledH1>
              <StyledP>
                Already registered? Click the button below to be redirected to
                the login page and start using Mohio!
              </StyledP>
              <LoginLinkButton to="/login">Login</LoginLinkButton>
            </StyledDiv5>
          </StyledDiv4>
        </StyledDiv3>
        <Mountains
          color1={theme.colors.tertiary}
          color2={theme.colors.secondary2}
        />
      </StyledDiv2>
    </StyledDiv1>
  );
};

export default Register;
