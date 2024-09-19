"use client";

import { useAuth } from "@/hooks/useAuth";
import { getChannelCasts } from "@/utils/neynar/utils/getChannelCasts";
import { CastGrid } from "./cast-grid";

const ChannelCasts = (props: { channelIds: string[] }) => {
  const auth = useAuth();

  return (
    <CastGrid
      hideChannelTag={true}
      queryFn={async ({ pageParam }) => {
        const { casts, cursor } = await getChannelCasts({
          channelIds: props.channelIds,
          cursor: pageParam,
          viewerFid: auth.state?.fid,
          shouldModerate: true,
        });

        return {
          casts,
          cursor,
        };
      }}
      queryKey={["casts", "channel", props.channelIds]}
    />
  );
};

export default ChannelCasts;
