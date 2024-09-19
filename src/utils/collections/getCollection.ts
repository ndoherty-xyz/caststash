"use server";

import { prismaClient } from "../prisma";
import { CollectionReturn } from "./types";

export const getCollection = async (args: {
  collectionId: string;
}): Promise<CollectionReturn> => {
  const collection = await prismaClient.$kysely
    .selectFrom("collections")
    .selectAll()
    .where("collections.id", "=", args.collectionId)
    .executeTakeFirstOrThrow();

  return {
    object: "cast-collection",
    ...collection,
  };
};
