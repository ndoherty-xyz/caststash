"use server";

import { neynarClient } from "..";
import { hydrateSaveStatesForCasts } from "@/utils/saved-casts/castSaveState";
import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";
import { FetchUserReactionsTypeEnum } from "@neynar/nodejs-sdk/build/api";

type NeynarCursorFix = { cursor?: string | null };

export const getUserLikes = async (args: {
  userFid: number;
  viewerFid?: number | undefined;
  cursor?: string;
}): Promise<{
  casts: NeynarCastWithSaveState[];
  cursor: string | undefined;
}> => {
  const res = await neynarClient.fetchUserReactions({
    fid: args.userFid,
    type: FetchUserReactionsTypeEnum.Likes,
    viewerFid: args.viewerFid,
    cursor: args.cursor,
  });

  const casts = await hydrateSaveStatesForCasts({
    casts: res.reactions.map((x) => x.cast),
    fid: args.viewerFid,
  });

  return {
    casts,
    cursor: (res as NeynarCursorFix).cursor ?? undefined, // fun one neynar
  };
};
