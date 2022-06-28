import { Alert, AlertTitle, Button, LinearProgress } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import { Container } from "../../components/Container";
import { SendButton, StyledInput } from "./styled";
import { Auth } from "aws-amplify";

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorSubmitting, setErrorSubmitting] = useState(false);

  const [changeSubmitted, setChangeSubmitted] = useState(false);
  const [errorChangeSubmitting, setErrorChangeSubmitting] = useState(false);

  return (
    <Container>
      <h1>Forgot your password?</h1>
      <p style={{ marginTop: 0, marginBottom: 0 }}>
        <em>
          <strong>No problem!</strong>
        </em>
      </p>
      <p style={{ marginTop: 0, marginBottom: 0 }}>
        Send a verification code to your registered email then make a new
        password.
      </p>
      <h2>Send Code</h2>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          username: "",
        }}
        validate={(values): Object => {
          type Errors = {
            username: string;
          };
          const errors: Errors = {
            username: "",
          };
          if (!values.username) {
            errors.username = "username Required";
          }
          if (errors.username.length > 0) {
            return errors;
          } else {
            return {};
          }
        }}
        onSubmit={async (values, { setSubmitting }): Promise<void> => {
          setSubmitted(false);
          setSubmitting(true);
          setErrorSubmitting(false);
          try {
            const response = await Auth.forgotPassword(values.username);
            console.log(response);
            setSubmitting(false);
            setSubmitted(true);
          } catch {
            setSubmitting(false);
            setErrorSubmitting(true);
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
          <>
            <span style={{ color: "orange" }}>
              {errors.username && touched.username && errors.username}
            </span>
            <form onSubmit={handleSubmit} style={{ marginBottom: "10px" }}>
              <StyledInput
                type="text"
                placeholder="enter your username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                name="username"
              />
              <SendButton type="submit" disabled={isSubmitting}>
                Send Verification Code
              </SendButton>
              {errorSubmitting && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  The username provided has not been registered.
                </Alert>
              )}
              {isSubmitting && (
                <Alert severity="info">
                  <AlertTitle>Sending</AlertTitle>
                  We are trying to send your verification code to your
                  registered email.
                  <LinearProgress
                    color="primary"
                    style={{
                      marginTop: "10px",
                    }}
                  />
                </Alert>
              )}
              {submitted && (
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Your verification code has successfully been sent to{" "}
                  {values.username}'s registered email.
                </Alert>
              )}
            </form>
          </>
        )}
      </Formik>
      <h2>Change Password</h2>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          code: "",
          username: "",
          password: "",
        }}
        validate={(values): Object => {
          type Errors = {
            code: string;
            username: string;
            password: string;
          };
          const errors: Errors = {
            code: "",
            username: "",
            password: "",
          };
          if (!values.code) {
            errors.code = "code Required";
          }
          if (!values.username) {
            errors.username = "Username Required";
          }
          if (!values.password) {
            errors.password = "password required";
          } else if (values.password.length < 8) {
            errors.password = "password must be at least 8 characters long.";
          }
          if (
            errors.code.length > 0 ||
            errors.password.length > 0 ||
            errors.username.length > 0
          ) {
            return errors;
          } else {
            return {};
          }
        }}
        onSubmit={async (values, { setSubmitting }): Promise<void> => {
          setChangeSubmitted(false);
          setSubmitting(true);
          setErrorChangeSubmitting(false);
          try {
            const response = await Auth.forgotPasswordSubmit(
              values.username,
              values.code,
              values.password
            );
            console.log(response);
            setSubmitting(false);
            setChangeSubmitted(true);
          } catch {
            setSubmitting(false);
            setErrorChangeSubmitting(true);
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
          <>
            <form onSubmit={handleSubmit} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "orange" }}>
                  {errors.username && touched.username && errors.username}
                </span>
                <StyledInput
                  type="text"
                  placeholder="enter your username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="username"
                />
                <span style={{ color: "orange" }}>
                  {errors.code && touched.code && errors.code}
                </span>
                <StyledInput
                  type="text"
                  placeholder="enter your code"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="code"
                />
                <span style={{ color: "orange" }}>
                  {errors.password && touched.password && errors.password}
                </span>
                <StyledInput
                  type="password"
                  placeholder="enter your new password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="password"
                />
              </div>

              <Button
                variant="contained"
                type="submit"
                style={{ marginBottom: "20px" }}
                disabled={isSubmitting}
              >
                Change Password
              </Button>
              {errorChangeSubmitting && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  The code provided is incorrect.
                </Alert>
              )}
              {isSubmitting && (
                <Alert severity="info">
                  <AlertTitle>Sending</AlertTitle>
                  We are trying to send your verification code to your
                  registered email.
                  <LinearProgress
                    color="primary"
                    style={{
                      marginTop: "10px",
                    }}
                  />
                </Alert>
              )}
              {changeSubmitted && (
                <Alert severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Your password has been successfully changed.
                </Alert>
              )}
            </form>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default ForgotPassword;
