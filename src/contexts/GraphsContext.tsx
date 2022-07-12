import React, { Dispatch, SetStateAction } from "react";

export type Graph = {
  graphTitleText: any;
  datasets: {
    dataName: string;
    dataSelector: string;
    datasetBackgroundColor: string;
    datasetBorderColor: string;
    dataURL?: string;
    deviceID?: string;
  }[];
  minTimestamp?: number;
  decimationSamples: number;
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
