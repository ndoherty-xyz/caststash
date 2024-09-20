"use client";

import { Button } from "@/components/ui/button";
// import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const auth = useAuth();

  const { channelId } = useParams<{
    channelId: string;
  }>();

  const activeChannelId = channelId
    ? channelId
    : // : auth.state?.fid
      // ? "for-you-feed"
      "aesthetic";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950">
      <div className="flex w-full flex-row border-b border-stone-300/25 dark:border-stone-400/25 py-1.5 overflow-x-scroll pl-6 no-scrollbar">
        {/* {auth.state?.fid ? (
          <Link href={`/feed`} scroll={false}>
            <Button
              className="m-1 ml-0"
              variant={activeChannelId === "for-you-feed" ? "outline" : "ghost"}
            >
              For You
            </Button>
          </Link>
        ) : null} */}

        {["aesthetic", "it", "art", "gen-art", "blank"].map((channelId) => {
          return (
            <Link key={channelId} href={`/feed/${channelId}`} scroll={false}>
              <Button
                className="m-1 ml-0"
                variant={activeChannelId === channelId ? "outline" : "ghost"}
              >
                #{channelId}
              </Button>
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
