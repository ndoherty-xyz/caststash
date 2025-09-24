"use server";

import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";
import { neynarClient } from "..";
import { requireValidSigner } from "./validateSignerUUID";
import { ReactionType } from "@neynar/nodejs-sdk/build/api";

export const likeCast = async (args: {
  castHash: string;
  signerUUID: string;
  userFid: number;
}): Promise<
  Pick<NeynarCastWithSaveState, "hash" | "viewer_context"> & {
    object: "cast";
  }
> => {
  await requireValidSigner(args.signerUUID, args.userFid);

  const res = await neynarClient.publishReaction({
    signerUuid: args.signerUUID,
    reactionType: ReactionType.Like,
    target: args.castHash,
  });

  if (res.success) {
    return {
      object: "cast",
      hash: args.castHash,
      viewer_context: {
        liked: true,
        recasted: false,
      },
    };
  } else {
    throw new Error("Error liking cast");
  }
};

export const unlikeCast = async (args: {
  castHash: string;
  signerUUID: string;
  userFid: number;
}): Promise<
  Pick<NeynarCastWithSaveState, "hash" | "viewer_context"> & {
    object: "cast";
  }
> => {
  await requireValidSigner(args.signerUUID, args.userFid);

  const res = await neynarClient.deleteReaction({
    signerUuid: args.signerUUID,
    reactionType: ReactionType.Like,
    target: args.castHash,
  });

  if (res.success) {
    return {
      object: "cast",
      hash: args.castHash,
      viewer_context: {
        liked: false,
        recasted: false,
      },
    };
  } else {
    throw new Error("Error liking cast");
  }
};
