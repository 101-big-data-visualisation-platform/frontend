import React, { Dispatch, SetStateAction } from "react";
type UserInfo = {
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
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export default AuthContext;
