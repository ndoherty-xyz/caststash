import { useAuth } from "@/hooks/useAuth";
import { getUserByFid } from "@/utils/neynar/utils/getUser";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Avatar } from "../users/avatar";
import Link from "next/link";
import { Button } from "../ui/button";

let authWindow: WindowProxy | null;
const authUrl = new URL("https://app.neynar.com/login");
const authOrigin = authUrl.origin;

export const LoginButton = () => {
  const auth = useAuth();

  const userQuery = useQuery({
    queryKey: ["userByUsername", auth.state?.fid],
    queryFn: async () => {
      if (!auth.state?.fid) return;
      const user = await getUserByFid(auth.state.fid, auth.state?.fid);
      return user;
    },
    enabled: !!auth.state?.fid,
  });

  const handleMessage = useCallback(
    (
      event: MessageEvent<{
        is_authenticated: boolean;
        signer_uuid: string;
        fid: number;
      }>
    ) => {
      if (event.origin === authOrigin && event.data.is_authenticated) {
        auth.login(event.data.fid, event.data.signer_uuid);

        if (authWindow) {
          authWindow.close();
        }

        window.removeEventListener("message", handleMessage);
      }
    },
    []
  );

  const handleSignIn = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
    if (!clientId) throw new Error("NO NEYNAR CLIENT ID");

    authUrl.searchParams.append("client_id", clientId);

    const isDesktop = window.matchMedia("(min-width: 800px)").matches;

    const width = 600,
      height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Define window features for the popup
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;

    const windowOptions = isDesktop ? windowFeatures : "fullscreen=yes";

    authWindow = window.open(authUrl.toString(), "_blank", windowOptions);
    window.addEventListener("message", handleMessage, false);
  }, []);

  return (
    <>
      {auth.state ? (
        <div className="flex flex-row gap-2 items-center">
          {userQuery.data ? (
            <Link
              href={`/${userQuery.data?.username}`}
              className="cursor-pointer"
            >
              <Avatar
                overrideSize={36}
                pfpUrl={userQuery.data?.pfp_url}
                size="md"
              />
            </Link>
          ) : null}
          <Button onClick={() => auth.logout()}>Logout</Button>
        </div>
      ) : (
        <Button onClick={() => handleSignIn()}>Login</Button>
      )}
    </>
  );
};
