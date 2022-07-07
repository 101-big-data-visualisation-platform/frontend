import React, { Dispatch, SetStateAction } from "react";

type Graph = {
  dataName: string;
  dataSelector: string;
  graphTitleText: string;
  datasetBackgroundColor: string;
  datasetBorderColor: string;
  decimationSamples: number;
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
