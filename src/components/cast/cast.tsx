"use client";

import { Avatar } from "../users/avatar";
import { Embed } from "./embed";
import Link from "next/link";
import { Heart } from "lucide-react";
import { SaveCastButton } from "./save-cast-button";
import { Badge } from "../ui/badge";
import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";

export const Cast = ({
  cast,
  hideChannelTag,
}: {
  cast: NeynarCastWithSaveState;
  hideChannelTag?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2 break-words bg-white rounded-2xl p-4 border border-stone-300/25">
      <Link href={`/${cast.author.username}`}>
        <div className="flex flex-row gap-2 items-center">
          <Avatar pfpUrl={cast.author.pfp_url} size="md" />
          <p className="text-sm font-bold">
            {cast.author.display_name ?? cast.author.username}
          </p>
        </div>
      </Link>

      <p className="text-sm">{cast.text}</p>
      {cast.embeds.map((x) => (
        <Embed embed={x} key={"cast_id" in x ? x.cast_id.hash : x.url} />
      ))}

      {cast.channel && !hideChannelTag ? (
        <div className="flex flex-row">
          <Badge variant="secondary">#{cast.channel.id}</Badge>
        </div>
      ) : null}

      <div className="flex flex-row pt-3 w-full items-center justify-between gap-2">
        <div className="flex flex-row gap-1">
          <Heart
            size={20}
            {...(cast.viewer_context?.liked
              ? { fill: "#ef4444", stroke: "#ef4444" }
              : {})}
          />
        </div>
        <SaveCastButton
          castHash={cast.hash}
          savedInCollections={cast.savedInCollectionIds ?? []}
        />
      </div>
    </div>
  );
};
