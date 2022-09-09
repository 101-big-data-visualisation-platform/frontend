import React, { Dispatch, SetStateAction } from "react";
export type UserInfo = {
  attributes: {
    email: string;
    email_verified: boolean;
    sub: string;
  };
  id: string;
  username: string;
};
type AuthContextType = {
  user: UserInfo | null;
  setUser: Dispatch<SetStateAction<null>>;
  fetchingUser: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  fetchingUser: false,
});

export default AuthContext;
