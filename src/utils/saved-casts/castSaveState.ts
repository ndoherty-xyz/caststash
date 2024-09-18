"use server";

import { requireValidSigner } from "../neynar/utils/validateSignerUUID";
import { prismaClient } from "../prisma";

export const getCollectionCastHasBeenSavedByUser = async (args: {
  fid: number;
  signerUUID: string;
  castHash: string;
}): Promise<Record<string, boolean>> => {
  await requireValidSigner(args.signerUUID, args.fid);

  const ownedCollectionsCastSavedIn = await prismaClient.$kysely
    .selectFrom("saved_casts")
    .innerJoin("collections", "saved_casts.collectionsId", "collections.id")
    .select(["collections.id"])
    .where("saved_casts.castHash", "=", args.castHash)
    .where("collections.deleted_at", "is", null)
    .where("collections.ownerFid", "=", args.fid)
    .where("saved_casts.deleted_at", "is", null)
    .execute();

  const returnVal: Record<string, boolean> = {};

  for (const entry of ownedCollectionsCastSavedIn) {
    returnVal[entry.id] = true;
  }

  return returnVal;
};
