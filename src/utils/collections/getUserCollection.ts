"use server";

import { collections, prismaClient } from "../prisma";

export const getUserCollections = async (args: {
  fid: number;
}): Promise<collections[]> => {
  const res = await prismaClient.collections.findMany({
    where: {
      ownerFid: args.fid,
      deleted_at: null,
    },
  });

  return res;
};
