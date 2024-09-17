"use client";

import { useAuth } from "@/hooks/useAuth";
import { getUserLikes } from "@/utils/neynar/utils/getUserLikes";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CastGrid } from "../cast-grid/cast-grid";

export const UserLikes = (props: { fid: number }) => {
  const auth = useAuth();
  const castQuery = useInfiniteQuery({
    queryKey: ["casts"],
    queryFn: async ({ pageParam }) => {
      const { casts, cursor } = await getUserLikes({
        userFid: props.fid,
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
