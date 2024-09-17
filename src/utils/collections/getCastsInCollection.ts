"use server";

import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { prismaClient } from "../prisma";
import { neynarClient } from "../neynar";

export const getCastsInCollection = async (args: {
  collectionId: string;
  cursor?: string | undefined;
  viewerFid?: number | undefined;
}): Promise<{ casts: Cast[]; cursor: string | undefined }> => {
  // get cast hashes for cursor from the collection
  const castHashes = await prismaClient.$kysely
    .selectFrom("saved_casts")
    .select(["saved_casts.castHash", "created_at"])
    .where("collectionsId", "=", args.collectionId)
    .where("created_at", "<", args.cursor ? new Date(args.cursor) : new Date())
    .where("deleted_at", "is", null)
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
