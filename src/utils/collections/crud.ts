"use server";

import { requireValidSigner } from "../neynar/utils/validateSignerUUID";
import { collections, prismaClient } from "../prisma";

export const createNewCollection = async (args: {
  fid: number;
  signerUUID: string;
  title: string;
  description?: string;
}): Promise<collections> => {
  await requireValidSigner(args.signerUUID, args.fid);

  const res = await prismaClient.collections.create({
    data: {
      ownerFid: args.fid,
      title: args.title,
      description: args.description ?? "",
    },
  });

  return res;
};

export const updateCollection = async (args: {
  fid: number;
  signerUUID: string;
  title: string;
  description?: string;
  collectionId: string;
}): Promise<collections> => {
  await requireValidSigner(args.signerUUID, args.fid);

  const res = await prismaClient.collections.update({
    where: {
      id: args.collectionId,
      ownerFid: args.fid,
    },
    data: {
      title: args.title,
      description: args.description ?? "",
      updated_at: new Date(),
    },
  });

  return res;
};

export const deleteCollection = async (args: {
  fid: number;
  signerUUID: string;
  collectionId: string;
}): Promise<collections> => {
  await requireValidSigner(args.signerUUID, args.fid);

  const res = await prismaClient.collections.update({
    where: {
      id: args.collectionId,
      ownerFid: args.fid,
    },
    data: {
      deleted_at: new Date(),
      updated_at: new Date(),
    },
  });

  return res;
};
