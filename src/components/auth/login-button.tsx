import { useAuth } from "@/hooks/useAuth";
import { useCallback, useEffect } from "react";

var authWindow: WindowProxy | null;

export const LoginButton = () => {
  const auth = useAuth();

  const handleMessage = useCallback(
    (
      event: MessageEvent<{
        is_authenticated: boolean;
        signer_uuid: string;
        fid: number;
      }>,
      authOrigin: string
    ) => {
      if (event.origin === authOrigin && event.data.is_authenticated) {
        auth.login(event.data.fid, event.data.signer_uuid);

        if (authWindow) {
          authWindow.close();
        }

        window.removeEventListener("message", handleMessage as any);
      }
    },
    []
  );

  const handleSignIn = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
    if (!clientId) throw new Error("NO NEYNAR CLIENT ID");

    const authUrl = new URL("https://app.neynar.com/login");
    const authOrigin = authUrl.origin;
    authUrl.searchParams.append("client_id", clientId);

    var isDesktop = window.matchMedia("(min-width: 800px)").matches;

    var width = 600,
      height = 700;
    var left = window.screen.width / 2 - width / 2;
    var top = window.screen.height / 2 - height / 2;

    // Define window features for the popup
    var windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;

    var windowOptions = isDesktop ? windowFeatures : "fullscreen=yes";

    authWindow = window.open(authUrl.toString(), "_blank", windowOptions);
    window.addEventListener(
      "message",
      function (event) {
        handleMessage(event, authOrigin);
      },
      false
    );
  }, []);

  return (
    <>
      {auth.state ? (
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xs">fid: {auth.state.fid}</p>
          <button
            className="py-2 px-3 text-sm bg-white rounded-xl"
            onClick={() => auth.logout()}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="py-2 px-3 text-sm bg-white rounded-xl"
          onClick={() => handleSignIn()}
        >
          Login
        </button>
      )}
    </>
  );
};
