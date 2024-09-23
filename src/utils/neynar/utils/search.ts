"use server";

import { Channel, User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { neynarClient } from "..";

export const neynarSearch = async (args: {
  query: string;
  viewerFid?: number | undefined;
}): Promise<{ channels: Channel[]; users: User[] }> => {
  const [channels, users] = await Promise.all([
    neynarClient.searchChannels(args.query, { limit: 5 }),
    neynarClient.searchUser(args.query, args.viewerFid, {
      limit: 5,
    }),
  ]);

  return {
    channels: channels.channels,
    users: users.result.users,
  };
};
