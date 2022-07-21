import { apiAWS } from ".";
import { Dashboard } from "../contexts/GraphsContext";

export const getWeatherData = async (
  deviceID: string,
  minTimeStamp: number
) => {
  return await apiAWS
    .get(`/data/weather?deviceID=${deviceID}&min=${minTimeStamp}`)
    .then((response) => response.data);
};

export const getTankData = async (
  deviceID: string,
  minTimeStamp: number,
  jwt: string
) => {
  return await apiAWS
    .get(`/data/tank?deviceID=${deviceID}&min=${minTimeStamp}`, {
      headers: {
        authorization: jwt,
      },
    })
    .then((response) => response.data);
};

export const getAWSData = async (
  deviceID: string,
  minTimeStamp: number,
  jwt: string,
  endpointURL: string
) => {
  try {
    return await apiAWS
      .get(`${endpointURL}?deviceID=${deviceID}&min=${minTimeStamp}`, {
        headers: {
          authorization: jwt,
        },
      })
      .then((response) => response.data);
  } catch (err) {
    alert(
      "You need to log in again to be able to access AWS services. Sorry for the inconvenience"
    );
  }
};

export const getAWSDashboard = async (jwt: string, username: string) => {
  return await apiAWS
    .get(`/data/dashboard?username=${username}`, {
      headers: {
        authorization: jwt,
      },
    })
    .then((response) => response.data);
};

export const addUserSettingsAWS = async (jwt: string, username: string) => {
  return await apiAWS.post(
    "/data/dashboard",
    {
      username,
    },
    {
      headers: {
        authorization: jwt,
      },
    }
  );
};

export const updateUserSettingsAWS = async (
  jwt: string,
  username: string,
  dashboard: Dashboard[] | undefined
) => {
  return await apiAWS.patch(
    "/data/dashboard",
    {
      username,
      dashboard,
    },
    {
      headers: {
        authorization: jwt,
      },
    }
  );
};
