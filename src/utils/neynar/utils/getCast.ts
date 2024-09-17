"use server";

import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "@/utils/neynar";
import assert from "node:assert";

export const getCast = async ({
  castHash,
}: {
  castHash: string;
}): Promise<Cast> => {
  const res = await neynarClient.fetchBulkCasts([castHash], {});

  assert(res.result.casts[0]);
  return res.result.casts[0];
};
