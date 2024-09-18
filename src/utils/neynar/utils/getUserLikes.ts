"use server";

import { ReactionsType } from "@neynar/nodejs-sdk";
import { neynarClient } from "..";
import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export const getUserLikes = async (args: {
  userFid: number;
  viewerFid?: number | undefined;
  cursor?: string;
}): Promise<{ casts: CastWithInteractions[]; cursor: string | undefined }> => {
  const res = await neynarClient.fetchUserReactions(
    args.userFid,
    ReactionsType.Likes,
    {
      viewerFid: args.viewerFid,
      cursor: args.cursor,
    }
  );

  return {
    casts: res.reactions.map((x) => x.cast),
    cursor: (res as any).cursor ?? undefined, // fun one neynar
  };
};
