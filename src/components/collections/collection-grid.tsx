"use client";

import { useAuth } from "@/hooks/useAuth";
import { getCastsInCollection } from "@/utils/collections/getCastsInCollection";
import { CastGrid } from "../cast-grid/cast-grid";

export const CollectionGrid = (props: { collectionId: string }) => {
  const auth = useAuth();

  return (
    <CastGrid
      queryFn={async ({ pageParam }) => {
        const { casts, cursor } = await getCastsInCollection({
          collectionId: props.collectionId,
          cursor: pageParam,
          viewerFid: auth.state?.fid,
        });

        return {
          casts,
          cursor,
        };
      }}
      queryKey={["collectionCasts", props.collectionId]}
    />
  );
};
