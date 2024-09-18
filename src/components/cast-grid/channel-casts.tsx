"use client";

import { useAuth } from "@/hooks/useAuth";
import { getChannelCasts } from "@/utils/neynar/utils/getChannelCasts";
import { CastGrid } from "./cast-grid";

const ChannelCasts = (props: { channelId: string }) => {
  const auth = useAuth();

  return (
    <CastGrid
      queryFn={async ({ pageParam }) => {
        const { casts, cursor } = await getChannelCasts({
          channelId: props.channelId,
          cursor: pageParam,
          viewerFid: auth.state?.fid,
        });

        return {
          casts,
          cursor,
        };
      }}
      queryKey={["casts", props.channelId]}
    />
  );
};

export default ChannelCasts;
