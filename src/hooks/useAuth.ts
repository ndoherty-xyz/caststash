import useLocalStorage from "./useLocalStorage";

export const useAuth = () => {
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

  if (!user) return { state: undefined, login, logout };

  const userAny = user as any;

  if ("fid" in userAny && "signerUuid" in userAny) {
    return {
      state: {
        fid: Number(userAny.fid),
        signerUUID: userAny.signerUuid as string,
      },
      login,
      logout,
    };
  } else {
    return { state: undefined, login, logout };
  }
};
