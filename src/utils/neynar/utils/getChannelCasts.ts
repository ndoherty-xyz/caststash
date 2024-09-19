"use server";

import { neynarClient } from "@/utils/neynar";
import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";
import { hydrateSaveStatesForCasts } from "@/utils/saved-casts/castSaveState";

export const getChannelCasts = async ({
  channelIds,
  cursor,
  viewerFid,
  shouldModerate,
}: {
  channelIds: string[];
  cursor?: string;
  viewerFid?: number | undefined;
  shouldModerate?: boolean;
}): Promise<{
  casts: NeynarCastWithSaveState[];
  cursor: string | undefined;
}> => {
  const res = await neynarClient.fetchFeedByChannelIds(channelIds, {
    viewerFid,
    cursor: cursor ? cursor : undefined,
    limit: 20,
    shouldModerate,
  });

  const casts = await hydrateSaveStatesForCasts({
    casts: res.casts,
    fid: viewerFid,
  });

  return {
    casts,
    cursor: res.next.cursor ?? undefined,
  };
};
