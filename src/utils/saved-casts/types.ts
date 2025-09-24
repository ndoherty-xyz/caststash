import { Cast } from "@neynar/nodejs-sdk/build/api";

export type NeynarCastWithSaveState = Cast & {
  savedInCollectionIds?: string[];
  saveCount: number;
};
