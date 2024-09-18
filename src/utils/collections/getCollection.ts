"use server";

import { collections, prismaClient } from "../prisma";

export const getCollection = async (args: {
  collectionId: string;
}): Promise<collections> => {
  const collection = await prismaClient.$kysely
    .selectFrom("collections")
    .selectAll()
    .where("collections.id", "=", args.collectionId)
    .executeTakeFirstOrThrow();

  return collection;
};
