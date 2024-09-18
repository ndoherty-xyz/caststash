"use client";

import ChannelCasts from "@/components/cast-grid/channel-casts";
import ForYouCasts from "@/components/cast-grid/for-you-casts";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

export default function HomeFeed() {
  const auth = useAuth();
  console.log(auth.state);

  const renderedCastFeed = useMemo(() => {
    if (auth.state?.fid) {
      return <ForYouCasts fid={auth.state.fid} />;
    } else {
      return <ChannelCasts channelIds={["art"]} />;
    }
  }, [auth.state]);

  return <div className="p-6 bg-stone-100">{renderedCastFeed}</div>;
}
