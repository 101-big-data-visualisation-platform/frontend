import React, { useContext, useState } from "react";
import { ThemeContext } from "styled-components";
import Mountains from "../../svg/mountains/Mountains";
import {
  ForgotPassword,
  InputLabel,
  LinkButton,
  LoginButton,
  LoginHeader,
  RegisterLinkButton,
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
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addUserSettingsAWS } from "../../api/dashboard";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
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
            <LoginHeader>Login</LoginHeader>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={{
                username: "",
                password: "",
              }}
              validate={(values): Object => {
                type Errors = {
                  username: string;
                  password: string;
                };
                const errors: Errors = {
                  username: "",
                  password: "",
                };

                if (!values.username) {
                  errors.username = "Required";
                }

                if (!values.password) {
                  errors.password = "Required";
                }

                if (errors.username.length > 0 || errors.password.length > 0) {
                  return errors;
                } else {
                  return {};
                }
              }}
              onSubmit={async (values, { setSubmitting }): Promise<void> => {
                setLoggedIn(false);
                setLoginError(false);
                let user;
                try {
                  user = await Auth.signIn(values.username, values.password);
                } catch (error) {
                  setLoginError(true);
                  setSubmitting(false);
                } finally {
                  if (user) {
                    const idToken = (await Auth.currentSession())
                      .getIdToken()
                      .getJwtToken();
                    setUser(user);
                    localStorage.setItem("authorization", idToken);
                    await addUserSettingsAWS(idToken, user.username);
                    setLoginError(false);
                    setSubmitting(false);
                    setLoggedIn(true);
                    navigate("/dashboard");
                  }
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ForgotPassword to="/forgotpassword">
                        Forgot password
                      </ForgotPassword>
                    </div>

                    <LoginButton type="submit" disabled={isSubmitting}>
                      Login
                    </LoginButton>
                  </StyledDiv6>
                  {loginError && (
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      You were unable to log in due to an incorrect combination
                      of username and password.
                    </Alert>
                  )}
                  {isSubmitting && (
                    <Alert severity="info">
                      <AlertTitle>Logging In</AlertTitle>
                      We are verifying your credentials.
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
                      Credentials successfully verified.
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
                Havn’t registered? No worries! Click the button to register an
                account to start using Mohio.
              </StyledP>
              <RegisterLinkButton to="/register">Register</RegisterLinkButton>
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

export default Login;
