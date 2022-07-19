import { LinearProgress, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import {
  ButtonsDiv,
  ModalDiv,
  AddButton,
  CancelButton,
  InputsDiv,
  AddDatasetDiv,
  ModalDivInner,
} from "./styled";
import { Formik } from "formik";
import GraphsContext, { Dataset } from "../../../contexts/GraphsContext";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

const AddGraph = ({
  open,
  handleClose,
  dashboardName,
}: {
  open: boolean;
  handleClose: () => void;
  dashboardName: string;
}) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
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
        <h1>Add Graph</h1>
        <ModalDivInner>
          <AddDatasetDiv>
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={{
                dataName: "",
                datasetBackgroundColor: "#ff0000",
                datasetBorderColor: "#ff0000",
                dataURL: "",
                deviceID: "",
              }}
              validate={(values): Object => {
                type Errors = {
                  dataName: string;
                  datasetBackgroundColor: string;
                  datasetBorderColor: string;
                  dataURL: string;
                  deviceID: string;
                };
                const errors: Errors = {
                  dataName: "",
                  datasetBackgroundColor: "",
                  datasetBorderColor: "",
                  dataURL: "",
                  deviceID: "",
                };

                if (!values.dataName) {
                  errors.dataName = "Required";
                }
                if (!values.datasetBackgroundColor) {
                  errors.datasetBackgroundColor = "Required";
                }
                if (!values.datasetBorderColor) {
                  errors.datasetBorderColor = "Required";
                }
                if (!values.dataURL) {
                  errors.dataURL = "Required";
                }
                if (!values.deviceID) {
                  errors.deviceID = "Required";
                }

                if (
                  errors.dataName.length > 0 ||
                  errors.datasetBackgroundColor.length > 0 ||
                  errors.datasetBorderColor.length > 0 ||
                  errors.dataURL.length > 0 ||
                  errors.deviceID.length > 0
                ) {
                  return errors;
                } else {
                  return {};
                }
              }}
              onSubmit={async (values): Promise<void> => {
                setDatasets((prevState) => [
                  ...prevState,
                  {
                    dataName: values.dataName,
                    datasetBackgroundColor: values.datasetBackgroundColor,
                    datasetBorderColor: values.datasetBorderColor,
                    dataURL: values.dataURL,
                    deviceID: values.deviceID,
                  },
                ]);
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
                    Dataset Background Color{" "}
                    <span style={{ color: "orange" }}>
                      {errors.datasetBackgroundColor &&
                        touched.datasetBackgroundColor &&
                        errors.datasetBackgroundColor}
                    </span>
                  </span>
                  <input
                    type="color"
                    name="datasetBackgroundColor"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.datasetBackgroundColor}
                  />
                  <br />
                  <span>
                    Dataset Border Color{" "}
                    <span style={{ color: "orange" }}>
                      {errors.datasetBorderColor &&
                        touched.datasetBorderColor &&
                        errors.datasetBorderColor}
                    </span>
                  </span>
                  <input
                    type="color"
                    name="datasetBorderColor"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.datasetBorderColor}
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
          </AddDatasetDiv>
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              graphTitleText: "",
              minTimestamp: 0,
              dataSelector: "",
              datasets: datasets,
            }}
            validate={(values): Object => {
              type Errors = {
                graphTitleText: string;
                minTimestamp: string;
                dataSelector: string;
                datasets: string;
              };
              const errors: Errors = {
                graphTitleText: "",
                minTimestamp: "",
                dataSelector: "",
                datasets: "",
              };

              if (!values.graphTitleText) {
                errors.graphTitleText = "Required";
              }
              if (values.minTimestamp === undefined) {
                errors.minTimestamp = "Required";
              }
              if (!values.dataSelector) {
                errors.dataSelector = "Required";
              }
              if (!datasets || datasets.length === 0) {
                errors.datasets = "Required";
              }

              if (
                errors.graphTitleText.length > 0 ||
                errors.minTimestamp.length > 0 ||
                errors.dataSelector.length > 0 ||
                errors.datasets.length > 0
              ) {
                return errors;
              } else {
                return {};
              }
            }}
            onSubmit={async (values): Promise<void> => {
              setSubmitting(true);
              const finalDatasets = datasets.map((dataset) => {
                return {
                  ...dataset,
                  dataName:
                    dataset.dataName + dataset.deviceID + values.minTimestamp,
                };
              });
              const finalMinTimestamp =
                values.minTimestamp !== 0
                  ? new Date(values.minTimestamp).valueOf()
                  : 0;
              let uuidString: string = uuidv4();
              while (
                allDashboards
                  ?.find((dashboard: any) => dashboard.name === dashboardName)
                  ?.allGraphs?.filter(
                    // eslint-disable-next-line no-loop-func
                    (graph) => graph.graphID === uuidString
                  )?.length ??
                -1 > 0
              ) {
                uuidString = uuidv4();
              }

              const dashboardsModified = allDashboards?.map((dashboard) => {
                if (dashboardName === dashboard.name) {
                  return {
                    name: dashboard.name,
                    allGraphs: [
                      ...dashboard.allGraphs,
                      {
                        graphID: uuidString,
                        datasets: finalDatasets,
                        graphTitleText: values.graphTitleText,
                        minTimestamp: finalMinTimestamp,
                        dataSelector: values.dataSelector,
                        decimationSamples: 5000,
                      },
                    ],
                  };
                } else {
                  return dashboard;
                }
              });

              try {
                await updateUserSettingsAWS(
                  localStorage.getItem("authorization") || "",
                  user?.username || "",
                  dashboardsModified
                );
              } catch (err) {
                console.log(err);
              } finally {
                setSubmitting(false);
                setDashboards(dashboardsModified);
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
              <form id="mainForm" onSubmit={handleSubmit}>
                <InputsDiv>
                  <h3>General Settings</h3>
                  <span>
                    Graph Title Text{" "}
                    <span style={{ color: "orange" }}>
                      {errors.graphTitleText &&
                        touched.graphTitleText &&
                        errors.graphTitleText}
                    </span>
                  </span>
                  <input
                    type="text"
                    name="graphTitleText"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.graphTitleText}
                  />
                  <br />
                  <span>
                    Starting Date{" "}
                    <span style={{ color: "orange" }}>
                      {errors.minTimestamp &&
                        touched.minTimestamp &&
                        errors.minTimestamp}
                    </span>
                  </span>
                  <input
                    type="datetime-local"
                    name="minTimestamp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.minTimestamp}
                  />
                  <br />
                  <span>
                    DynamoDB Data Selector{" "}
                    <span style={{ color: "orange" }}>
                      {errors.dataSelector &&
                        touched.dataSelector &&
                        errors.dataSelector}
                    </span>
                  </span>
                  <input
                    type="text"
                    name="dataSelector"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.dataSelector}
                  />
                  <h3>
                    Datasets{" "}
                    <span style={{ color: "orange" }}>
                      {errors.datasets?.toString()}
                    </span>
                  </h3>
                  <div style={{ height: "200px", overflowY: "auto" }}>
                    {datasets.length > 0
                      ? datasets?.map((dataset) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <span>{dataset.dataName}</span>
                              <span>{dataset.datasetBackgroundColor}</span>
                              <span>{dataset.datasetBorderColor}</span>
                              <span>{dataset.dataURL}</span>
                              <span>{dataset.deviceID}</span>
                              <button
                                onClick={() => {
                                  setDatasets((prevState) => {
                                    return prevState.filter(
                                      (prevDataset) =>
                                        prevDataset.dataName !==
                                          dataset.dataName ||
                                        prevDataset.datasetBackgroundColor !==
                                          dataset.datasetBackgroundColor ||
                                        prevDataset.datasetBorderColor !==
                                          dataset.datasetBorderColor ||
                                        prevDataset.dataURL !==
                                          dataset.dataURL ||
                                        prevDataset.deviceID !==
                                          dataset.deviceID
                                    );
                                  });
                                }}
                              >
                                Delete
                              </button>
                              <hr />
                            </div>
                          );
                        })
                      : "You have no datasets added."}
                  </div>
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

export default AddGraph;
