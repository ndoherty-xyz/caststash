"use server";

import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { prismaClient } from "../prisma";
import { NeynarCastWithSaveState } from "./types";

export const hydrateSaveStatesForCasts = async (args: {
  casts: CastWithInteractions[];
  fid?: number;
}): Promise<NeynarCastWithSaveState[]> => {
  if (!args.fid) {
    return args.casts;
  }

  const allHashes = args.casts.map((x) => x.hash);
  const saveEntries = await prismaClient.$kysely
    .selectFrom("saved_casts")
    .innerJoin("collections", "saved_casts.collectionsId", "collections.id")
    .select(["saved_casts.castHash", "saved_casts.collectionsId"])
    .where("saved_casts.castHash", "in", allHashes)
    .where("collections.deleted_at", "is", null)
    .where("collections.ownerFid", "=", args.fid)
    .where("saved_casts.deleted_at", "is", null)
    .execute();

  const hashToCollectionsMap: Record<string, string[]> = {};
  for (const entry of saveEntries) {
    if (hashToCollectionsMap[entry.castHash]) {
      hashToCollectionsMap[entry.castHash].push(entry.collectionsId);
    } else {
      hashToCollectionsMap[entry.castHash] = [entry.collectionsId];
    }
  }

  const returnVal: NeynarCastWithSaveState[] = [];
  for (const cast of args.casts) {
    returnVal.push({
      ...cast,
      savedInCollectionIds: hashToCollectionsMap[cast.hash] ?? [],
    });
  }

  return returnVal;
};
