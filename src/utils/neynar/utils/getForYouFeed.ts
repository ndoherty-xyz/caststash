"use server";

import { neynarClient } from "@/utils/neynar";
import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";
import { hydrateSaveStatesForCasts } from "@/utils/saved-casts/castSaveState";

export const getForYouFeed = async ({
  cursor,
  fid,
}: {
  cursor?: string;
  fid: number;
}): Promise<{
  casts: NeynarCastWithSaveState[];
  cursor: string | undefined;
}> => {
  const res = await neynarClient.fetchFeedForYou({
    fid,
    viewerFid: fid,
    cursor: cursor ? cursor : undefined,
    limit: 20,
  });

  const casts = await hydrateSaveStatesForCasts({
    casts: res.casts,
    fid: fid,
  });

  return {
    casts,
    cursor: res.next.cursor ?? undefined,
  };
};
