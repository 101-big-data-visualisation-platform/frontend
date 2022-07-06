import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
const AuthWrapper = ({ children }: { children: JSX.Element }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return children;
  }
};

export default AuthWrapper;
