import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Auth } from "aws-amplify";
import { CenteredDiv } from "./CenteredDiv";
import DataContext from "../contexts/DataContext";
const AuthWrapper = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const { allData } = useContext(DataContext);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [user, setUser] = useState();
  const fetchUserInfo = async () => {
    const userInfo = await Auth.currentUserInfo();
    setUser(userInfo);
    setFetchingUser(false);
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (fetchingUser) {
    return (
      <CenteredDiv>
        <h1>Fetching user...</h1>
      </CenteredDiv>
    );
  } else if (!fetchingUser && !user) {
    return <Navigate to="/login" />;
  } else if (location.pathname.includes("detailed") && allData?.length === 0) {
    return <Navigate to="/dashboard" />;
  } else {
    return children;
  }
};

export default AuthWrapper;
