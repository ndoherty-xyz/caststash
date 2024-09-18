"use server";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "..";
import { convertToV2User } from "@neynar/nodejs-sdk";
import assert from "node:assert";

export const getUserByUsername = async (
  username: string,
  viewerFid?: number
): Promise<User> => {
  const userRes = await neynarClient.lookupUserByUsername(username, viewerFid);

  return convertToV2User(userRes.result.user);
};

export const getUserByFid = async (
  fid: number,
  viewerFid?: number
): Promise<User> => {
  const userRes = await neynarClient.fetchBulkUsers([fid], { viewerFid });

  assert(userRes.users[0]);
  return userRes.users[0];
};
