"use server";

import { Cast } from "@neynar/nodejs-sdk/build/api";
import { prismaClient } from "../prisma";
import { NeynarCastWithSaveState } from "./types";

export const hydrateSaveStatesForCasts = async (args: {
  casts: Cast[];
  fid?: number;
}): Promise<NeynarCastWithSaveState[]> => {
  const allHashes = args.casts.map((x) => x.hash);

  if (!args.fid) {
    const saveCounts = await prismaClient.$kysely
      .selectFrom("saved_casts")
      .select(({ fn }) => [
        "saved_casts.castHash",
        fn.countAll<number>().as("savedCount"),
      ])
      .where("saved_casts.castHash", "in", allHashes)
      .where("deleted_at", "is", null)
      .groupBy("saved_casts.castHash")
      .execute();

    const hashToSaveCountMap: Record<string, number> = {};

    for (const entry of saveCounts) {
      hashToSaveCountMap[entry.castHash] = entry.savedCount;
    }

    const returnVal: NeynarCastWithSaveState[] = [];
    for (const cast of args.casts) {
      returnVal.push({
        ...cast,
        saveCount: hashToSaveCountMap[cast.hash] ?? 0,
      });
    }

    return returnVal;
  }

  const [saveCounts, saveEntries] = await Promise.all([
    prismaClient.$kysely
      .selectFrom("saved_casts")
      .innerJoin("collections", "saved_casts.collectionsId", "collections.id")
      .select(({ fn }) => [
        "saved_casts.castHash",
        fn.countAll().as("savedCount"),
      ])
      .where("saved_casts.castHash", "in", allHashes)
      .where("saved_casts.deleted_at", "is", null)
      .where("collections.deleted_at", "is", null)
      .groupBy("saved_casts.castHash")
      .execute(),
    prismaClient.$kysely
      .selectFrom("saved_casts")
      .innerJoin("collections", "saved_casts.collectionsId", "collections.id")
      .select(["saved_casts.castHash", "saved_casts.collectionsId"])
      .where("saved_casts.castHash", "in", allHashes)
      .where("collections.deleted_at", "is", null)
      .where("collections.ownerFid", "=", args.fid)
      .where("saved_casts.deleted_at", "is", null)
      .execute(),
  ]);

  const hashToDataMap: Record<
    string,
    { ownedCollections: string[]; saveCount: number }
  > = {};

  for (const entry of saveEntries) {
    if (hashToDataMap[entry.castHash]) {
      hashToDataMap[entry.castHash].ownedCollections.push(entry.collectionsId);
    } else {
      hashToDataMap[entry.castHash] = {
        ...hashToDataMap[entry.castHash],
        ownedCollections: [entry.collectionsId],
      };
    }
  }

  for (const entry of saveCounts) {
    hashToDataMap[entry.castHash] = {
      ...hashToDataMap[entry.castHash],
      saveCount: Number(entry.savedCount),
    };
  }

  const returnVal: NeynarCastWithSaveState[] = [];
  for (const cast of args.casts) {
    returnVal.push({
      ...cast,
      savedInCollectionIds: hashToDataMap[cast.hash]?.ownedCollections ?? [],
      saveCount: hashToDataMap[cast.hash]?.saveCount ?? 0,
    });
  }

  return returnVal;
};
