"use client";

import { useAuth } from "@/hooks/useAuth";
import { getUserLikes } from "@/utils/neynar/utils/getUserLikes";
import { CastGrid } from "../cast-grid/cast-grid";

export const UserLikes = (props: { fid: number }) => {
  const auth = useAuth();

  return (
    <CastGrid
      queryFn={async ({ pageParam }) => {
        const { casts, cursor } = await getUserLikes({
          userFid: props.fid,
          cursor: pageParam,
          viewerFid: auth.state?.fid,
        });

        return {
          casts,
          cursor,
        };
      }}
      queryKey={["likes", props.fid]}
    />
  );
};
