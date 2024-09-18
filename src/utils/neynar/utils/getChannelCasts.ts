"use server";

import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "@/utils/neynar";

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
}): Promise<{ casts: CastWithInteractions[]; cursor: string | undefined }> => {
  const res = await neynarClient.fetchFeedByChannelIds(channelIds, {
    viewerFid,
    cursor: cursor ? cursor : undefined,
    limit: 20,
    shouldModerate,
  });

  return {
    casts: res.casts,
    cursor: res.next.cursor ?? undefined,
  };
};
