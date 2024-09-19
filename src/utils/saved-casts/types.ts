import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export type NeynarCastWithSaveState = CastWithInteractions & {
  savedInCollectionIds?: string[];
  saveCount: number;
};
