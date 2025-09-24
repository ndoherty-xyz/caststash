"use server";

import { neynarClient } from "@/utils/neynar";
import { Cast } from "@neynar/nodejs-sdk/build/api";
import assert from "node:assert";

export const getCast = async ({
  castHash,
}: {
  castHash: string;
}): Promise<Cast> => {
  const res = await neynarClient.fetchBulkCasts({ casts: [castHash] });

  assert(res.result.casts[0]);
  return res.result.casts[0];
};
