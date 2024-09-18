"use server";

import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "@/utils/neynar";

export const getChannelCasts = async ({
  channelId,
  cursor,
  viewerFid,
}: {
  channelId: string;
  cursor?: string;
  viewerFid?: number | undefined;
}): Promise<{ casts: CastWithInteractions[]; cursor: string | undefined }> => {
  const res = await neynarClient.fetchFeedByChannelIds([channelId], {
    viewerFid,
    cursor: cursor ? cursor : undefined,
    limit: 20,
  });

  return {
    casts: res.casts,
    cursor: res.next.cursor ?? undefined,
  };
};
