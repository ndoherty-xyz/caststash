"use server";

import { requireValidSigner } from "../neynar/utils/validateSignerUUID";
import { prismaClient } from "../prisma";
import { NeynarCastWithSaveState } from "../saved-casts/types";

export const removeCastFromCollection = async (args: {
  fid: number;
  signerUUID: string;
  castHash: string;
  collectionId: string;
}): Promise<
  Pick<NeynarCastWithSaveState, "hash" | "savedInCollectionIds"> & {
    object: "cast";
  }
> => {
  await requireValidSigner(args.signerUUID, args.fid);

  const collection = await prismaClient.collections.findUnique({
    where: { id: args.collectionId },
  });

  if (!collection || args.fid !== collection.ownerFid)
    throw new Error("No permissions to add to this collection");

  await prismaClient.saved_casts.update({
    where: {
      castHash_collectionsId: {
        castHash: args.castHash,
        collectionsId: args.collectionId,
      },
    },
    data: {
      deleted_at: new Date(),
      updated_at: new Date(),
    },
  });

  const savedInCollectionIds = (
    await prismaClient.$kysely
      .selectFrom("saved_casts")
      .innerJoin("collections", "saved_casts.collectionsId", "collections.id")
      .select(["saved_casts.collectionsId"])
      .where("saved_casts.castHash", "=", args.castHash)
      .where("collections.deleted_at", "is", null)
      .where("collections.ownerFid", "=", args.fid)
      .where("saved_casts.deleted_at", "is", null)
      .execute()
  ).map((col) => col.collectionsId);

  return {
    object: "cast",
    hash: args.castHash,
    savedInCollectionIds,
  };
};
