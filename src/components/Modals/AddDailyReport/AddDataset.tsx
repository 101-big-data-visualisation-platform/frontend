import { Formik, useFormikContext } from "formik";
import React, { FC, SetStateAction } from "react";
import { v4 } from "uuid";
import {
  DatasetComparison,
  ReportDataset,
} from "../../../contexts/GraphsContext";

const AddDataset: FC<{
  datasetName: string;
  parentValues: DatasetComparison;
  setAddingDataset: React.Dispatch<SetStateAction<boolean>>;
  setCurrentDataset: React.Dispatch<SetStateAction<string>>;
}> = ({ datasetName, parentValues, setAddingDataset, setCurrentDataset }) => {
  return (
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
        interface IItem {
          [key: string]: DatasetComparison;
        }
        ((parentValues as unknown as IItem)[
          datasetName
        ] as unknown as ReportDataset) = {
          ID: v4(),
          dataName: values.dataName,
          dataURL: values.dataURL,
          deviceID: values.deviceID,
        };
        setAddingDataset(false);
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
          id="datasetForm"
        >
          <h2>Add {datasetName}</h2>
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
          <button type="submit" form="datasetForm">
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setAddingDataset(false);
              setCurrentDataset("");
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </Formik>
  );
};

export default AddDataset;
