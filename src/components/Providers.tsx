"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 2,
      gcTime: 1000 * 60 * 20,
    },
  },
});

export const Providers = (props: React.PropsWithChildren) => {
  return (
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
        {props.children}
      </NeynarContextProvider>
    </QueryClientProvider>
  );
};
