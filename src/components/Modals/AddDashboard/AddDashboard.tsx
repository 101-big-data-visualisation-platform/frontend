import { LinearProgress, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import {
  ButtonsDiv,
  ModalDiv,
  AddButton,
  CancelButton,
  ModalDivInner,
  InputsDiv,
} from "./styled";
import { Formik } from "formik";
import GraphsContext from "../../../contexts/GraphsContext";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";

const AddDashboard = ({
  open,
  handleClose,
  setDashboardName,
}: {
  open: boolean;
  handleClose: () => void;
  setDashboardName: (arg: string) => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards } = useContext(GraphsContext);
  return (
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalDiv>
        <h1>Add Dashboard</h1>
        <ModalDivInner>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              dashboardName: "",
            }}
            validate={(values): Object => {
              type Errors = {
                dashboardName: string;
              };
              const errors: Errors = {
                dashboardName: "",
              };

              if (!values.dashboardName) {
                errors.dashboardName = "Required";
              }

              if (errors.dashboardName.length > 0) {
                return errors;
              } else {
                return {};
              }
            }}
            onSubmit={async (values): Promise<void> => {
              setSubmitting(true);
              const updatedDashboards = [
                ...(allDashboards as any),
                {
                  name: values.dashboardName,
                  allGraphs: [],
                },
              ];
              try {
                await updateUserSettingsAWS(
                  localStorage.getItem("authorization") || "",
                  user?.username || "",
                  updatedDashboards
                );
              } catch (err) {
                console.log(err);
              } finally {
                setSubmitting(false);
                setDashboards(updatedDashboards);
                setDashboardName(values.dashboardName);
                handleClose();
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
            }) => (
              <form
                id="mainForm"
                onSubmit={handleSubmit}
                style={{ width: "100%" }}
              >
                <InputsDiv>
                  <span>
                    New Dashboard Name{" "}
                    <span style={{ color: "orange" }}>
                      {errors.dashboardName &&
                        touched.dashboardName &&
                        errors.dashboardName}
                    </span>
                  </span>
                  <input
                    style={{ width: "100%" }}
                    type="text"
                    name="dashboardName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.dashboardName}
                  />
                </InputsDiv>
              </form>
            )}
          </Formik>
        </ModalDivInner>
        {submitting && (
          <LinearProgress color="inherit" style={{ marginBottom: "10px" }} />
        )}
        <ButtonsDiv>
          <AddButton disabled={submitting} type="submit" form="mainForm">
            Add
          </AddButton>
          <CancelButton disabled={submitting} onClick={handleClose}>
            Cancel
          </CancelButton>
        </ButtonsDiv>
      </ModalDiv>
    </Modal>
  );
};

export default AddDashboard;
