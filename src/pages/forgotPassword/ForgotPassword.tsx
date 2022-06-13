import { Alert, AlertTitle, LinearProgress } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import { Container } from "../../components/Container";
import { SendButton, StyledDiv1, StyledInput } from "./styled";

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errorSubmitting, setErrorSubmitting] = useState(false);

  return (
    <Container>
      <StyledDiv1>
        <h1>Forgot your password?</h1>
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          <em>
            <strong>No problem!</strong>
          </em>
        </p>
        <p style={{ marginTop: 0, marginBottom: 0 }}>
          Send your old password to your registered email
        </p>
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{
            email: "",
          }}
          validate={(values): Object => {
            type Errors = {
              email: string;
            };
            const errors: Errors = {
              email: "",
            };
            if (!values.email) {
              errors.email = "Email Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid Email";
            }
            if (errors.email.length > 0) {
              return errors;
            } else {
              return {};
            }
          }}
          onSubmit={(values, { setSubmitting }): void => {
            setSubmitted(false);
            setSubmitting(true);
            setErrorSubmitting(false);
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
              setSubmitted(true);
            }, 1000);
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
                {errors.email && touched.email && errors.email}
              </span>
              <form onSubmit={handleSubmit} style={{ marginBottom: "10px" }}>
                <StyledInput
                  type="email"
                  placeholder="enter your registered email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                />
                <SendButton type="submit" disabled={isSubmitting}>
                  Send
                </SendButton>
                {errorSubmitting && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    You were unable to log in due to an incorrect combination of
                    username and password.
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
                {submitted && (
                  <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    Credentials successfully verified.
                  </Alert>
                )}
              </form>
            </>
          )}
        </Formik>
      </StyledDiv1>
    </Container>
  );
};

export default ForgotPassword;
