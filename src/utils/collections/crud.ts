"use server";

import { requireValidSigner } from "../neynar/utils/validateSignerUUID";
import { prismaClient } from "../prisma";
import { CollectionReturn } from "./types";

export const createNewCollection = async (args: {
  fid: number;
  signerUUID: string;
  title: string;
  description?: string;
}): Promise<CollectionReturn> => {
  await requireValidSigner(args.signerUUID, args.fid);

  const res = await prismaClient.collections.create({
    data: {
      ownerFid: args.fid,
      title: args.title,
      description: args.description ?? "",
    },
  });

  return {
    object: "cast-collection",
    ...res,
  };
};

export const updateCollection = async (args: {
  fid: number;
  signerUUID: string;
  title: string;
  description?: string;
  collectionId: string;
}): Promise<CollectionReturn> => {
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

  return {
    object: "cast-collection",
    ...res,
  };
};

export const deleteCollection = async (args: {
  fid: number;
  signerUUID: string;
  collectionId: string;
}): Promise<CollectionReturn> => {
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

  return {
    object: "cast-collection",
    ...res,
  };
};
