"use server";

import { prismaClient } from "../prisma";
import { CollectionReturn } from "./types";

export const getUserCollections = async (args: {
  fid: number;
}): Promise<CollectionReturn[]> => {
  const collections = await prismaClient.collections.findMany({
    where: {
      ownerFid: args.fid,
      deleted_at: null,
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  return collections.map((col) => ({ object: "cast-collection", ...col }));
};
