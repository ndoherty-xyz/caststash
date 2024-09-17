import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export const LoginButton = () => {
  const auth = useAuth();

  useEffect(() => {
    (window as any).onNeynarSignInSuccess = (data: {
      signer_uuid: string;
      fid: number;
    }) => {
      auth.login(data.fid, data.signer_uuid);
    };

    return () => {
      delete (window as any).onNeynarSignInSuccess; // Clean up the global callback
    };
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

var authWindow: any;

function handleMessage(
  event: any,
  authOrigin: string,
  successCallback: string
) {
  if (event.origin === authOrigin && event.data.is_authenticated) {
    if (typeof (window as any)[successCallback] === "function") {
      (window as any)[successCallback](event.data); // Call the global callback function
    }

    if (authWindow) {
      authWindow.close();
    }

    window.removeEventListener("message", handleMessage as any);
  }
}

function handleSignIn() {
  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  if (!clientId) throw new Error("NO NEYNAR CLIENT ID");

  const neynarLoginUrl =
    process.env.NEXT_PUBLIC_NEYNAR_LOGIN_URL || "https://app.neynar.com/login";

  var authUrl = new URL(neynarLoginUrl);
  authUrl.searchParams.append("client_id", clientId);

  var authOrigin = new URL(neynarLoginUrl).origin;

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
      handleMessage(event, authOrigin, "onNeynarSignInSuccess");
    },
    false
  );
}
