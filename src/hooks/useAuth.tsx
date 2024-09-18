import React, { useContext } from "react";
import useLocalStorage from "./useLocalStorage";

type AuthUser = {
  signerUUID: string;
  fid: number;
};

type AuthContextValue = {
  login: ((fid: number, signerUUID: string) => void) | undefined;
  logout: (() => void) | undefined;
  state: AuthUser | undefined;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context.login || !context.logout) {
    throw new Error(
      "AuthContext helper functions are missing! Is there something wrong with how you're using useAuth?"
    );
  }

  return {
    login: context.login,
    logout: context.logout,
    state: context.state,
  };
};

export const AuthContext = React.createContext<AuthContextValue>({
  state: undefined,
  login: undefined,
  logout: undefined,
});

export const AuthProvider = (props: React.PropsWithChildren) => {
  const [user, setUser, removeUser] = useLocalStorage("farcaster-user");

  const login = (fid: number, signerUUID: string) => {
    setUser({
      signerUuid: signerUUID,
      fid: fid,
    });
  };

  const logout = () => {
    setUser(undefined);
    removeUser();
  };

  //eslint-disable-next-line
  const userAny = user as any;
  const userReturn = !user
    ? undefined
    : "fid" in userAny && "signerUuid" in userAny
    ? {
        fid: Number(userAny.fid),
        signerUUID: userAny.signerUuid as string,
      }
    : undefined;

  return (
    <AuthContext.Provider value={{ state: userReturn, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
