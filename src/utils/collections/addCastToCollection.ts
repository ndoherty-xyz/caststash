"use server";

import { requireValidSigner } from "../neynar/utils/validateSignerUUID";
import { prismaClient, saved_casts } from "../prisma";

export const addCastToCollection = async (args: {
  fid: number;
  signerUUID: string;
  castHash: string;
  collectionId: string;
}): Promise<saved_casts> => {
  await requireValidSigner(args.signerUUID, args.fid);

  const collection = await prismaClient.collections.findUnique({
    where: { id: args.collectionId },
  });

  if (!collection || args.fid !== collection.ownerFid)
    throw new Error("No permissions to add to this collection");

  const res = await prismaClient.saved_casts.create({
    data: {
      castHash: args.castHash,
      collectionId: {
        connect: {
          id: args.collectionId,
        },
      },
    },
  });

  return res;
};
