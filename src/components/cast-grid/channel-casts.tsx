"use client";

import { useAuth } from "@/hooks/useAuth";
import { getChannelCasts } from "@/utils/neynar/utils/getChannelCasts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CastGrid } from "./cast-grid";

export const ChannelCasts = (props: { channelId: string }) => {
  const auth = useAuth();
  const castQuery = useInfiniteQuery({
    queryKey: ["casts", props.channelId],
    queryFn: async ({ pageParam }) => {
      const { casts, cursor } = await getChannelCasts({
        channelId: props.channelId,
        cursor: pageParam,
        viewerFid: auth.state?.fid,
      });

      return {
        casts,
        cursor,
      };
    },
    initialPageParam: "",
    getNextPageParam(lastPage) {
      console.log(lastPage.cursor);
      return lastPage.cursor;
    },
  });

  const allCasts = castQuery.data?.pages.map((x) => x.casts).flat() ?? [];

  return <CastGrid data={allCasts} fetchMore={castQuery.fetchNextPage} />;
};
