"use server";

import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { prismaClient } from "../prisma";
import { neynarClient } from "../neynar";

export const getCastsInCollection = async (args: {
  collectionId: string;
  cursor?: string | undefined;
  viewerFid?: number | undefined;
}): Promise<{ casts: CastWithInteractions[]; cursor: string | undefined }> => {
  // get cast hashes for cursor from the collection
  const castHashes = await prismaClient.$kysely
    .selectFrom("saved_casts")
    .innerJoin("collections", "collections.id", "saved_casts.collectionsId")
    .select(["saved_casts.castHash", "saved_casts.created_at"])
    .where("collections.id", "=", args.collectionId)
    .where("collections.deleted_at", "is", null)
    .where(
      "saved_casts.created_at",
      "<",
      args.cursor ? new Date(args.cursor) : new Date()
    )
    .where("saved_casts.deleted_at", "is", null)
    .limit(20)
    .execute();

  const res = await neynarClient.fetchBulkCasts(
    castHashes.map((x) => x.castHash),
    { viewerFid: args.viewerFid }
  );

  const lastCast = castHashes.at(-1);
  const cursor =
    castHashes.length < 20
      ? undefined
      : lastCast
      ? lastCast.created_at.toISOString()
      : undefined;

  return {
    casts: res.result.casts,
    cursor,
  };
};
