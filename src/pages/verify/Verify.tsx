import React, { useState } from "react";
import { Alert, AlertTitle, LinearProgress } from "@mui/material";
import { Formik } from "formik";
import { Container } from "../../components/Container";
import { SendButton, StyledInput } from "./styled";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

const Verify: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorSubmitting, setErrorSubmitting] = useState(false);
  return (
    <Container>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          username: "",
          code: "",
        }}
        validate={(values): Object => {
          type Errors = {
            username: string;
            code: string;
          };
          const errors: Errors = {
            username: "",
            code: "",
          };
          if (!values.username) {
            errors.username = "Username Required";
          }
          if (!values.code) {
            errors.code = "Code Required";
          }
          if (errors.username.length > 0 || errors.code.length > 0) {
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
            await Auth.confirmSignUp(values.username, values.code);
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
            setSubmitted(true);
          } catch (error) {
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
            <form onSubmit={handleSubmit} style={{ marginBottom: "10px" }}>
              <h1>Verify Account</h1>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "orange" }}>
                  {errors.username && touched.username && errors.username}
                </span>
                <StyledInput
                  type="text"
                  placeholder="enter username"
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
                  placeholder="enter code from email"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="code"
                />
              </div>

              <SendButton type="submit" disabled={isSubmitting}>
                Verify
              </SendButton>
              {errorSubmitting && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  Invalid code or username provided. You may try again.
                </Alert>
              )}
              {isSubmitting && (
                <Alert severity="info">
                  <AlertTitle>Sending</AlertTitle>
                  We are trying to send your old password to your registered
                  email.
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
                  Your account has been successfully verified. You can now log
                  in <Link to="/login">here</Link>.
                </Alert>
              )}
            </form>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default Verify;
