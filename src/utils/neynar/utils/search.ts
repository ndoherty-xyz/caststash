"use server";

import { Channel, User } from "@neynar/nodejs-sdk/build/api";
import { neynarClient } from "..";

export const neynarSearch = async (args: {
  query: string;
  viewerFid?: number | undefined;
}): Promise<{ channels: Channel[]; users: User[] }> => {
  const [channels, users] = await Promise.all([
    neynarClient.searchChannels({ q: args.query, limit: 5 }),
    neynarClient.searchUser({
      q: args.query,
      viewerFid: args.viewerFid,
      limit: 5,
    }),
  ]);

  return {
    channels: channels.channels,
    users: users.result.users,
  };
};
