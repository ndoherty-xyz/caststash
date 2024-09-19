"use client";

import { CastGrid } from "./cast-grid";
import { getForYouFeed } from "@/utils/neynar/utils/getForYouFeed";

const ForYouCasts = (props: { fid: number }) => {
  return (
    <CastGrid
      queryFn={async ({ pageParam }) => {
        const { casts, cursor } = await getForYouFeed({
          cursor: pageParam,
          fid: props.fid,
        });

        return {
          casts,
          cursor,
        };
      }}
      queryKey={["casts", "for-you", props.fid]}
    />
  );
};

export default ForYouCasts;
