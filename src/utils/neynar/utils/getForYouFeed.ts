"use server";

import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "@/utils/neynar";

export const getForYouFeed = async ({
  cursor,
  fid,
}: {
  cursor?: string;
  fid: number;
}): Promise<{ casts: CastWithInteractions[]; cursor: string | undefined }> => {
  const res = await neynarClient.fetchFeedForYou(fid, {
    viewerFid: fid,
    cursor: cursor ? cursor : undefined,
    limit: 20,
  });

  return {
    casts: res.casts,
    cursor: res.next.cursor ?? undefined,
  };
};
