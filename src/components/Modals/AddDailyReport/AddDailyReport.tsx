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
import GraphsContext, { ReportDataset } from "../../../contexts/GraphsContext";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import { v4 } from "uuid";

const AddDailyReport = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [datasets, setDatasets] = useState([] as ReportDataset[]);
  const { user } = useContext(AuthContext);
  const { allDashboards, setDashboards, setSelectedDashboard } =
    useContext(GraphsContext);
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
        <h1>Add Daily Report</h1>
        <ModalDivInner>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              dataName: "",
              dataURL: "",
              deviceID: "",
            }}
            validate={(values): Object => {
              type Errors = {
                dataName: string;
                dataURL: string;
                deviceID: string;
              };
              const errors: Errors = {
                dataName: "",
                dataURL: "",
                deviceID: "",
              };

              if (!values.dataName) {
                errors.dataName = "Required";
              }
              if (!values.dataURL) {
                errors.dataURL = "Required";
              }
              if (!values.deviceID) {
                errors.deviceID = "Required";
              }

              if (
                errors.dataName.length > 0 ||
                errors.dataURL.length > 0 ||
                errors.deviceID.length > 0
              ) {
                return errors;
              } else {
                return {};
              }
            }}
            onSubmit={async (values): Promise<void> => {
              setDatasets((prevState: ReportDataset[]) => {
                let idIsNotUnique = false;
                let uniqueID;
                do {
                  uniqueID = v4();
                  for (let i = 0; i < prevState.length; i++) {
                    if (prevState[i].ID === uniqueID) {
                      idIsNotUnique = true;
                    }
                  }
                } while (idIsNotUnique);
                return [
                  ...prevState,
                  {
                    dataName: values.dataName,
                    dataURL: values.dataURL,
                    deviceID: values.deviceID,
                    ID: uniqueID,
                  },
                ];
              });
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
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={handleSubmit}
              >
                <h2>Add Dataset</h2>
                <span>
                  Dataset Name{" "}
                  <span style={{ color: "orange" }}>
                    {errors.dataName && touched.dataName && errors.dataName}
                  </span>
                </span>
                <input
                  type="text"
                  name="dataName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dataName}
                />
                <br />
                <span>
                  Data URL{" "}
                  <span style={{ color: "orange" }}>
                    {errors.dataURL && touched.dataURL && errors.dataURL}
                  </span>
                </span>
                <input
                  type="text"
                  name="dataURL"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dataURL}
                />
                <br />
                <span>
                  Device ID{" "}
                  <span style={{ color: "orange" }}>
                    {errors.deviceID && touched.deviceID && errors.deviceID}
                  </span>
                </span>
                <input
                  type="text"
                  name="deviceID"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.deviceID}
                />
                <br />
                <button type="submit">Add</button>
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

export default AddDailyReport;
