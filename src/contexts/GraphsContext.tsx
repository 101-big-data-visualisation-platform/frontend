import React, { Dispatch, SetStateAction } from "react";

export type Dataset = {
  dataName: string;
  datasetBackgroundColor: string;
  datasetBorderColor: string;
  dataURL?: string;
  deviceID?: string;
};

export type Graph = {
  graphID: string;
  graphTitleText: any;
  datasets: Dataset[];
  minTimestamp?: number;
  decimationSamples: number;
  dataSelector: string;
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
