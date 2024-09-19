"use client";

import HomeFeed from "@/screens/feed";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  const { channelId } = useParams<{
    channelId: string;
  }>();

  return <HomeFeed channelId={channelId} />;
}
