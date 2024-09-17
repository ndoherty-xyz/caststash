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
