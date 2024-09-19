"use client";

import ChannelCasts from "@/components/cast-grid/channel-casts";
import ForYouCasts from "@/components/cast-grid/for-you-casts";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

export default function ChannelFeed(props: { channelId?: string | undefined }) {
  const auth = useAuth();

  const renderedCastFeed = useMemo(() => {
    if (auth.state?.fid && !props.channelId) {
      return <ForYouCasts fid={auth.state.fid} />;
    } else {
      return (
        <ChannelCasts
          channelIds={[props.channelId ? props.channelId : "art"]}
        />
      );
    }
  }, [auth.state, props.channelId]);

  return <div className="p-6 bg-stone-100">{renderedCastFeed}</div>;
}
