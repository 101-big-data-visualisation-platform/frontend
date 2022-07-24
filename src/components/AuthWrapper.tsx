import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { CenteredDiv } from "./CenteredDiv";
const AuthWrapper = ({ children }: { children: JSX.Element }) => {
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
  } else {
    return children;
  }
};

export default AuthWrapper;
