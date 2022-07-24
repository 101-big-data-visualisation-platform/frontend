import { apiAWS } from ".";
import { Dashboard } from "../contexts/GraphsContext";
import { Auth } from "aws-amplify";

const getIdToken = async () => {
  return (await Auth.currentSession()).getIdToken().getJwtToken();
};

export const getWeatherData = async (
  deviceID: string,
  minTimeStamp: number
) => {
  return await apiAWS
    .get(`/data/weather?deviceID=${deviceID}&min=${minTimeStamp}`)
    .then((response) => response.data);
};

export const getTankData = async (deviceID: string, minTimeStamp: number) => {
  return await apiAWS
    .get(`/data/tank?deviceID=${deviceID}&min=${minTimeStamp}`, {
      headers: {
        authorization: await getIdToken(),
      },
    })
    .then((response) => response.data);
};

export const getAWSData = async (
  deviceID: string,
  minTimeStamp: number,
  endpointURL: string
) => {
  try {
    return await apiAWS
      .get(`${endpointURL}?deviceID=${deviceID}&min=${minTimeStamp}`, {
        headers: {
          authorization: await getIdToken(),
        },
      })
      .then((response) => response.data);
  } catch (err) {
    alert(
      "You need to log in again to be able to access AWS services. Sorry for the inconvenience"
    );
  }
};

export const getAWSDashboard = async (username: string) => {
  return await apiAWS
    .get(`/data/dashboard?username=${username}`, {
      headers: {
        authorization: await getIdToken(),
      },
    })
    .then((response) => response.data);
};

export const addUserSettingsAWS = async (username: string) => {
  return await apiAWS.post(
    "/data/dashboard",
    {
      username,
    },
    {
      headers: {
        authorization: await getIdToken(),
      },
    }
  );
};

export const updateUserSettingsAWS = async (
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
        authorization: await getIdToken(),
      },
    }
  );
};
