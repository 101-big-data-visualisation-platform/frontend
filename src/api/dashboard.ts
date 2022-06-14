import { api } from ".";

export const getBatteryData = async () => {
  return await api.get("/data/battery").then((response) => response.data);
};
export const getTankData = async () => {
  return await api.get("/data/tank").then((response) => response.data);
};
