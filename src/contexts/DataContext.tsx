import React, { Dispatch, SetStateAction } from "react";

type Data = {
  items?: [];
  name: string;
  dailyReport: any;
};

type DataContextType = {
  allData: Data[] | null;
  setData: Dispatch<SetStateAction<any>>;
  updatingData: boolean;
  setUpdatingData: Dispatch<SetStateAction<any>>;
};
const DataContext = React.createContext<DataContextType>({
  allData: [],
  setData: () => {},
  updatingData: false,
  setUpdatingData: () => {},
});

export default DataContext;
