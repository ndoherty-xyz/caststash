"use server";
import { User } from "@neynar/nodejs-sdk/build/api";
import { neynarClient } from "..";
import assert from "node:assert";

export const getUserByUsername = async (
  username: string,
  viewerFid?: number
): Promise<User> => {
  const userRes = await neynarClient.lookupUserByUsername({
    username,
    viewerFid,
  });

  return userRes.user;
};

export const getUserByFid = async (
  fid: number,
  viewerFid?: number
): Promise<User> => {
  const userRes = await neynarClient.fetchBulkUsers({ fids: [fid], viewerFid });

  assert(userRes.users[0]);
  return userRes.users[0];
};
