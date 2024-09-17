"use client";

import { Cast as NeynarCast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Avatar } from "../users/avatar";
import { Embed } from "./embed";

export const Cast = ({ cast }: { cast: NeynarCast }) => {
  return (
    <div className="flex flex-col gap-2 break-words bg-white rounded-lg p-4">
      <div className="flex flex-row gap-2 items-center">
        <Avatar pfpUrl={cast.author.pfp_url} size="md" />
        <p className="text-sm font-bold">
          {cast.author.display_name ?? cast.author.username}
        </p>
      </div>

      <p className="text-sm">{cast.text}</p>
      {cast.embeds.map((x) => (
        <Embed embed={x} />
      ))}
    </div>
  );
};
