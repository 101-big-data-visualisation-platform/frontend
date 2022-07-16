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

type GraphsContextType = {
  allGraphs: Graph[] | null;
  setGraphs: Dispatch<SetStateAction<any>>;
};
const GraphsContext = React.createContext<GraphsContextType>({
  allGraphs: [],
  setGraphs: () => {},
});

export default GraphsContext;
