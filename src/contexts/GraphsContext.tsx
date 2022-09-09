import React, { Dispatch, SetStateAction } from "react";
export type Step = {
  range: number[];
  color: string;
  ID: string;
};
export type Threshold = {
  line: {
    color: string;
    width: number;
  };
  thickness: number;
  value: number;
};
export type GaugeDetails = {
  steps: Step[];
  threshold: Threshold;
};

export type Dataset = {
  dataName: string;
  ID: string;
  datasetBackgroundColor: string;
  datasetBorderColor: string;
  dataURL?: string;
  deviceID?: string;
  singleStatisticMin?: number;
  singleStatisticMax?: number;
  singleStatisticDetails?: GaugeDetails;
};

export type Graph = {
  graphID: string;
  graphTitleText: any;
  datasets: Dataset[];
  minTimestamp?: number;
  decimationSamples: number;
  dataSelector: string;
  graphType: string;
  // Make these properties required once backend is finalized
};

export type Dashboard = {
  name: string;
  allGraphs: Graph[];
};

type GraphsContextType = {
  allDashboards: Dashboard[] | null;
  selectedDashboard: string;
  setDashboards: Dispatch<SetStateAction<any>>;
  setSelectedDashboard: Dispatch<SetStateAction<any>>;
};
const GraphsContext = React.createContext<GraphsContextType>({
  allDashboards: [],
  selectedDashboard: "",
  setDashboards: () => {},
  setSelectedDashboard: () => {},
});

export default GraphsContext;
