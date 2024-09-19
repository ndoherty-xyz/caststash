"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";
import { QueryNormalizerProvider } from "@normy/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient();
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// Create a client
export const Providers = (props: React.PropsWithChildren) => {
  const [queryClient] = useState(getQueryClient());

  return (
    <QueryNormalizerProvider
      queryClient={queryClient}
      normalizerConfig={{
        devLogging: true,
        getNormalizationObjectKey: (obj) => {
          if (
            "object" in obj &&
            typeof obj.object === "string" &&
            obj.object === "cast" &&
            "hash" in obj &&
            typeof obj.hash === "string"
          ) {
            // Cast cache key
            return `cast-${obj.hash}`;
          }

          if (
            "object" in obj &&
            typeof obj.object === "string" &&
            obj.object === "user" &&
            "fid" in obj &&
            typeof obj.fid === "number"
          ) {
            // User cache key
            return `user-${obj.fid}`;
          }

          if (
            "object" in obj &&
            typeof obj.object === "string" &&
            obj.object === "cast-collection" &&
            "id" in obj &&
            typeof obj.id === "string"
          ) {
            // Cast collection cache key
            return `cast-collection-${obj.id}`;
          }

          return undefined;
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <NeynarContextProvider
          settings={{
            clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
            defaultTheme: Theme.Light,
            eventsCallbacks: {
              onAuthSuccess: () => {},
              onSignout() {},
            },
          }}
        >
          <AuthProvider>{props.children}</AuthProvider>
        </NeynarContextProvider>
      </QueryClientProvider>
    </QueryNormalizerProvider>
  );
};
