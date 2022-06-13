import { api } from ".";

export const getData = async () => {
  return await api.get("/data/battery").then((response) => response.data);
};
