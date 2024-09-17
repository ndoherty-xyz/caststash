"use server";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "..";
import { convertToV2User } from "@neynar/nodejs-sdk";

export const getUserByUsername = async (
  username: string,
  viewerFid?: number
): Promise<User> => {
  const userRes = await neynarClient.lookupUserByUsername(username, viewerFid);

  return convertToV2User(userRes.result.user);
};
