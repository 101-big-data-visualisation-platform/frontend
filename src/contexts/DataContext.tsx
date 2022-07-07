import React, { Dispatch, SetStateAction } from "react";

type Data = {
  items: [];
  name: string;
};

type DataContextType = {
  allData: Data[] | null;
  setData: Dispatch<SetStateAction<any>>;
  updatingData: boolean;
};
const DataContext = React.createContext<DataContextType>({
  allData: [],
  setData: () => {},
  updatingData: false,
});

export default DataContext;
