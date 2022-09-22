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
import GraphsContext, {
  DailyReport,
  DatasetComparison,
} from "../../../contexts/GraphsContext";
import { updateUserSettingsAWS } from "../../../api/dashboard";
import AuthContext from "../../../contexts/AuthContext";
import { v4 } from "uuid";
import AddDataset from "./AddDataset";

const AddDailyReport = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [datasets, setDatasets] = useState([] as DatasetComparison[]);
  const [addingDataset, setAddingDataset] = useState(false);
  const [currentDataset, setCurrentDataset] = useState("commonDataset");
  const [isComparingBetweenTwo, setIsComparingBetweenTwo] = useState(false);
  const [isSingleSelector, setIsSingleSelector] = useState(true);
  const [isSingleTime, setIsSingleTime] = useState(true);
  const [addDataCompare, setAddDataCompare] = useState(false);
  const [values, setValues] = useState({} as DatasetComparison);
  const { user } = useContext(AuthContext);
  const {
    allDashboards,
    setDashboards,
    setSelectedDashboard,
    selectedDashboard: dashboardName,
  } = useContext(GraphsContext);
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
          <button
            type="button"
            onClick={() => {
              setAddDataCompare(true);
            }}
          >
            Add Datasets to Compare
          </button>
          {addDataCompare && (
            <Formik
              validateOnChange={false}
              validateOnBlur={false}
              initialValues={
                {
                  datasetA: undefined,
                  datasetB: undefined,
                  commonDataset: undefined,
                  uniqueSelectorA: "",
                  uniqueSelectorB: "",
                  commonDataSelector: "",
                  timeToCompareA: "",
                  timeToCompareB: "",
                  commonTime: "",
                } as DatasetComparison
              }
              validate={(values): Object => {
                type Errors = {
                  datasetA: string;
                  datasetB: string;
                  commonDataset: string;
                  commonDataSelector: string;
                  uniqueSelectorA: string;
                  uniqueSelectorB: string;
                  timeToCompareA: string;
                  timeToCompareB: string;
                  commonTime: string;
                };
                const errors: Errors = {
                  datasetA: "",
                  datasetB: "",
                  commonDataset: "",
                  commonDataSelector: "",
                  uniqueSelectorA: "",
                  uniqueSelectorB: "",
                  timeToCompareA: "",
                  timeToCompareB: "",
                  commonTime: "",
                };

                if (
                  !values.datasetA &&
                  !values.datasetB &&
                  !values.commonDataset
                ) {
                  errors.datasetA = "Required";
                  errors.datasetB = "Required";
                  errors.commonDataset = "Required";
                } else if (!values.datasetA && values.datasetB) {
                  errors.datasetA = "Required";
                  if (values.commonDataset) {
                    errors.commonDataset =
                      "You can't have a common dataset if A or B has a value.";
                  }
                } else if (values.datasetA && !values.datasetB) {
                  errors.datasetB = "Required";
                  if (values.commonDataset) {
                    errors.commonDataset =
                      "You can't have a common dataset if A or B has a value.";
                  }
                } else if (
                  values.datasetA &&
                  values.datasetB &&
                  values.commonDataset
                ) {
                  errors.commonDataset =
                    "You can't have a common dataset if A or B has a value.";
                }

                if (
                  !values.uniqueSelectorA &&
                  !values.uniqueSelectorB &&
                  !values.commonDataSelector
                ) {
                  errors.uniqueSelectorA = "Required";
                  errors.uniqueSelectorB = "Required";
                  errors.commonDataSelector = "Required";
                } else if (!values.uniqueSelectorA && values.uniqueSelectorB) {
                  errors.uniqueSelectorA = "Required";
                  if (values.commonDataSelector) {
                    errors.commonDataSelector =
                      "You can't have a common data selector if A or B has a value.";
                  }
                } else if (values.uniqueSelectorA && !values.uniqueSelectorB) {
                  errors.uniqueSelectorB = "Required";
                  if (values.commonDataSelector) {
                    errors.commonDataSelector =
                      "You can't have a common data selector if A or B has a value.";
                  }
                } else if (
                  values.uniqueSelectorA &&
                  values.uniqueSelectorB &&
                  values.commonDataSelector
                ) {
                  errors.commonDataSelector =
                    "You can't have a common data selector if A or B has a value.";
                }

                if (
                  !values.timeToCompareA &&
                  !values.timeToCompareB &&
                  !values.commonTime
                ) {
                  errors.timeToCompareA = "Required";
                  errors.timeToCompareB = "Required";
                  errors.commonTime = "Required";
                } else if (!values.timeToCompareA && values.timeToCompareB) {
                  errors.timeToCompareA = "Required";
                  if (values.commonTime) {
                    errors.commonTime =
                      "You can't have a common time if A or B has a value.";
                  }
                } else if (values.timeToCompareA && !values.timeToCompareB) {
                  errors.timeToCompareB = "Required";
                  if (values.commonTime) {
                    errors.commonTime =
                      "You can't have a common time if A or B has a value.";
                  }
                } else if (
                  values.timeToCompareA &&
                  values.timeToCompareB &&
                  values.commonTime
                ) {
                  errors.commonTime =
                    "You can't have a common time if A or B has a value.";
                }

                if (
                  errors.datasetA.length > 0 ||
                  errors.datasetB.length > 0 ||
                  errors.commonDataset.length > 0 ||
                  errors.uniqueSelectorA.length > 0 ||
                  errors.uniqueSelectorB.length > 0 ||
                  errors.commonDataSelector.length > 0 ||
                  errors.timeToCompareA.length > 0 ||
                  errors.timeToCompareB.length > 0 ||
                  errors.commonTime.length > 0
                ) {
                  return errors;
                } else {
                  return {};
                }
              }}
              onSubmit={async (values): Promise<void> => {
                let uuidString: string = v4();
                while (
                  datasets.filter(
                    // eslint-disable-next-line no-loop-func
                    (dataset) => dataset.ID === uuidString
                  )?.length ??
                  -1 > 0
                ) {
                  uuidString = v4();
                }
                setDatasets((prevState: DatasetComparison[]) => {
                  return [
                    ...prevState,
                    {
                      ID: uuidString,
                      commonDataset: values.commonDataset,
                      commonDataSelector: values.commonDataSelector,
                      datasetA: values.datasetA,
                      datasetB: values.datasetB,
                      uniqueSelectorA: values.uniqueSelectorA,
                      uniqueSelectorB: values.uniqueSelectorB,
                      timeToCompareA: values.timeToCompareA,
                      timeToCompareB: values.timeToCompareB,
                      commonTime: values.commonTime,
                    },
                  ] as DatasetComparison[];
                });
                setAddDataCompare(false);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => {
                setValues(values);
                return (
                  <form
                    style={{ display: "flex", flexDirection: "column" }}
                    onSubmit={handleSubmit}
                  >
                    <h2>Add Datasets to compare</h2>
                    <button
                      type="button"
                      onClick={() => {
                        setIsComparingBetweenTwo(true);
                        values.commonDataset = undefined;
                      }}
                    >
                      Compare Two Datasets
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsComparingBetweenTwo(false);
                        values.datasetA = undefined;
                        values.datasetB = undefined;
                      }}
                    >
                      Compare Within One Dataset
                    </button>
                    {isComparingBetweenTwo ? (
                      <div>
                        <button
                          onClick={() => {
                            setAddingDataset(false);
                            setAddingDataset(true);
                            setCurrentDataset("datasetA");
                          }}
                          type="button"
                        >
                          Add dataset A
                        </button>
                        <span>
                          Dataset A{" "}
                          <span style={{ color: "orange" }}>
                            {errors.datasetA &&
                              touched.datasetA &&
                              errors.datasetA}
                          </span>
                        </span>
                        <p>{JSON.stringify(values?.datasetA)}</p>
                        <button
                          onClick={() => {
                            setAddingDataset(false);
                            setAddingDataset(true);
                            setCurrentDataset("datasetB");
                          }}
                          type="button"
                        >
                          Add dataset B
                        </button>
                        <span>
                          Dataset B{" "}
                          <span style={{ color: "orange" }}>
                            {errors.datasetB &&
                              touched.datasetB &&
                              errors.datasetB}
                          </span>
                        </span>
                        <p>{JSON.stringify(values?.datasetB)}</p>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            setAddingDataset(false);
                            setAddingDataset(true);
                            setCurrentDataset("commonDataset");
                          }}
                          type="button"
                        >
                          Add common dataset
                        </button>
                        <span>
                          Common Dataset{" "}
                          <span style={{ color: "orange" }}>
                            {errors.commonDataset &&
                              touched.commonDataset &&
                              errors.commonDataset}
                          </span>
                        </span>
                        <p>{JSON.stringify(values?.commonDataset)}</p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSingleSelector(true);
                        values.uniqueSelectorA = "";
                        values.uniqueSelectorB = "";
                      }}
                    >
                      Common Selector
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSingleSelector(false);
                        values.commonDataSelector = "";
                      }}
                    >
                      Separate Selectors
                    </button>
                    {isSingleSelector ? (
                      <>
                        <span>
                          Common Data Selector{" "}
                          <span style={{ color: "orange" }}>
                            {errors.commonDataSelector &&
                              touched.commonDataSelector &&
                              errors.commonDataSelector}
                          </span>
                        </span>
                        <input
                          name="commonDataSelector"
                          value={values.commonDataSelector}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </>
                    ) : (
                      <>
                        <span>
                          Unique Selector A{" "}
                          <span style={{ color: "orange" }}>
                            {errors.uniqueSelectorA &&
                              touched.uniqueSelectorA &&
                              errors.uniqueSelectorA}
                          </span>
                        </span>
                        <input
                          name="uniqueSelectorA"
                          value={values.uniqueSelectorA}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span>
                          Unique Selector B{" "}
                          <span style={{ color: "orange" }}>
                            {errors.uniqueSelectorB &&
                              touched.uniqueSelectorB &&
                              errors.uniqueSelectorB}
                          </span>
                        </span>
                        <input
                          name="uniqueSelectorB"
                          value={values.uniqueSelectorB}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSingleTime(true);
                        values.timeToCompareA = "";
                        values.timeToCompareB = "";
                      }}
                    >
                      Common Time
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSingleTime(false);
                        values.commonTime = "";
                      }}
                    >
                      Separate Times
                    </button>
                    {isSingleTime ? (
                      <>
                        <span>
                          Common Time{" "}
                          <span style={{ color: "orange" }}>
                            {errors.commonTime &&
                              touched.commonTime &&
                              errors.commonTime}
                          </span>
                        </span>
                        <select
                          name="commonTime"
                          value={values.commonTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">None</option>
                          <option value="oneDay">oneDay</option>
                          <option value="oneWeek">oneWeek</option>
                          <option value="oneMonth">oneMonth</option>
                          <option value="oneYear">oneYear</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <span>
                          Time A{" "}
                          <span style={{ color: "orange" }}>
                            {errors.timeToCompareA &&
                              touched.timeToCompareA &&
                              errors.timeToCompareA}
                          </span>
                        </span>
                        <select
                          name="timeToCompareA"
                          value={values.timeToCompareA}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">None</option>
                          <option value="oneDay">oneDay</option>
                          <option value="oneWeek">oneWeek</option>
                          <option value="oneMonth">oneMonth</option>
                          <option value="oneYear">oneYear</option>
                        </select>
                        <span>
                          Time B{" "}
                          <span style={{ color: "orange" }}>
                            {errors.timeToCompareB &&
                              touched.timeToCompareB &&
                              errors.timeToCompareB}
                          </span>
                        </span>
                        <select
                          name="timeToCompareB"
                          value={values.timeToCompareB}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">None</option>
                          <option value="oneDay">oneDay</option>
                          <option value="oneWeek">oneWeek</option>
                          <option value="oneMonth">oneMonth</option>
                          <option value="oneYear">oneYear</option>
                        </select>
                      </>
                    )}

                    <button type="submit">Add</button>
                    <button
                      type="button"
                      onClick={() => setAddDataCompare(false)}
                    >
                      Cancel
                    </button>
                  </form>
                );
              }}
            </Formik>
          )}
          {addingDataset && (
            <AddDataset
              parentValues={values}
              datasetName={currentDataset}
              setAddingDataset={setAddingDataset}
              setCurrentDataset={setCurrentDataset}
            />
          )}
          <Formik
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={
              {
                dailyReportTitle: "",
                datasetComparisons: datasets,
              } as DailyReport
            }
            validate={(values): Object => {
              type Errors = {
                dailyReportTitle: string;
                datasetComparisons: string;
              };
              const errors: Errors = {
                dailyReportTitle: "",
                datasetComparisons: "",
              };

              if (!values.dailyReportTitle) {
                errors.dailyReportTitle = "Required";
              }
              if (!datasets || datasets.length === 0) {
                errors.datasetComparisons = "Required";
              }

              if (
                errors.dailyReportTitle.length > 0 ||
                errors.datasetComparisons.length > 0
              ) {
                return errors;
              } else {
                return {};
              }
            }}
            onSubmit={async (values): Promise<void> => {
              setSubmitting(true);
              let uuidString: string = v4();
              while (
                allDashboards
                  ?.find((dashboard: any) => dashboard.name === dashboardName)
                  ?.allDailyReports?.filter(
                    // eslint-disable-next-line no-loop-func
                    (report) => report.dailyReportID === uuidString
                  )?.length ??
                -1 > 0
              ) {
                uuidString = v4();
              }

              const dashboardsModified = allDashboards?.map((dashboard) => {
                if (dashboardName === dashboard.name) {
                  return {
                    ...dashboard,
                    allDailyReports: [
                      ...dashboard.allDailyReports,
                      {
                        ...values,
                        dailyReportID: uuidString,
                      },
                    ],
                  };
                } else {
                  return dashboard;
                }
              });

              try {
                await updateUserSettingsAWS(
                  user?.username || "",
                  dashboardsModified
                );
              } catch (err) {
                //console.log(err);
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
                  <h3>Daily Report Settings</h3>
                  <span>
                    Daily Report Title{" "}
                    <span style={{ color: "orange" }}>
                      {errors.dailyReportTitle &&
                        touched.dailyReportTitle &&
                        errors.dailyReportTitle}
                    </span>
                  </span>
                  <input
                    type="text"
                    name="dailyReportTitle"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.dailyReportTitle}
                  />
                  <span>
                    Dataset comparisons{" "}
                    <span style={{ color: "orange" }}>
                      {errors.datasetComparisons?.toString()}
                    </span>
                  </span>
                  {datasets.map((dataset) => (
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setDatasets((prevState) =>
                            prevState.filter(
                              (prevDataset) => prevDataset.ID !== dataset.ID
                            )
                          );
                        }}
                      >
                        delete
                      </button>
                      {dataset.datasetA && (
                        <div>
                          <div>{dataset.datasetA.dataName}</div>
                          <div>{dataset.datasetA.dataURL}</div>
                          <div>{dataset.datasetA.deviceID}</div>
                        </div>
                      )}
                      {dataset.datasetB && (
                        <div>
                          <div>{dataset.datasetB.dataName}</div>
                          <div>{dataset.datasetB.dataURL}</div>
                          <div>{dataset.datasetB.deviceID}</div>
                        </div>
                      )}
                      {dataset.commonDataset && (
                        <div>
                          <div>{dataset.commonDataset.dataName}</div>
                          <div>{dataset.commonDataset.dataURL}</div>
                          <div>{dataset.commonDataset.deviceID}</div>
                        </div>
                      )}
                      <div>{dataset.uniqueSelectorA}</div>
                      <div>{dataset.uniqueSelectorB}</div>
                      <div>{dataset.commonDataSelector}</div>
                      <div>{dataset.timeToCompareA}</div>
                      <div>{dataset.timeToCompareB}</div>
                      <div>{dataset.commonTime}</div>
                    </div>
                  ))}
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

export default AddDailyReport;
