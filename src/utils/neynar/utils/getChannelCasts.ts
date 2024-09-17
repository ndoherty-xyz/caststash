"use server";

import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "@/utils/neynar";

export const getSomeoneBuildChannelCasts = async ({
  cursor,
}: {
  cursor?: string;
}): Promise<{ casts: Cast[]; cursor: string | undefined }> => {
  const res = await neynarClient.fetchFeedByChannelIds(["someone-build"], {
    cursor: cursor ? cursor : undefined,
    limit: 20,
  });

  return {
    casts: res.casts,
    cursor: res.next.cursor ?? undefined,
  };
};
