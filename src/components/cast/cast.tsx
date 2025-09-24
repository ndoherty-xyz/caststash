"use client";

import { Avatar } from "../users/avatar";
import { Embed } from "./embed";
import Link from "next/link";
import { SaveCastButton } from "./save-cast-button";
import { Badge } from "../ui/badge";
import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";
import { LikeCastButton } from "./like-cast-button";
import { ArrowUpRightFromSquare } from "lucide-react";
import { Button } from "../ui/button";
import { getElapsedTimeToNow } from "@/utils/time";

export const Cast = ({
  cast,
  hideChannelTag,
}: {
  cast: NeynarCastWithSaveState;
  hideChannelTag?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-3 break-words bg-white dark:bg-stone-800/70 rounded-2xl p-4 pb-1.5 border border-stone-300/25 dark:border-stone-900/25">
      <div className="flex flex-row justify-between items-center gap-2">
        <Link href={`/${cast.author.username}`}>
          <div className="flex flex-row gap-2 items-center">
            <Avatar pfpUrl={cast.author.pfp_url} size="md" />
            <p className="text-sm font-bold">{`@${cast.author.username}`}</p>
          </div>
        </Link>
        <p className="text-sm text-stone-950/50 dark:text-stone-50/50">
          {getElapsedTimeToNow(new Date(cast.timestamp))}
        </p>
      </div>

      {cast.text ? <p className="text-sm">{cast.text}</p> : null}
      {cast.embeds.map((x) => (
        <Embed embed={x} key={"cast" in x ? x.cast.hash : x.url} />
      ))}

      {cast.channel && !hideChannelTag ? (
        <Link
          href={`/feed/${cast.channel.id}`}
          className="w-fit cursor-pointer"
        >
          <Badge variant="outline">#{cast.channel.id}</Badge>
        </Link>
      ) : null}

      <div className="flex flex-row w-full items-center justify-between gap-2">
        <div className="flex flex-row gap-1.5 -ml-2.5">
          <LikeCastButton
            likeCount={cast.reactions.likes_count}
            castHash={cast.hash}
            viewerContext={cast.viewer_context}
          />
          <SaveCastButton
            saveCount={cast.saveCount}
            castHash={cast.hash}
            savedInCollections={cast.savedInCollectionIds ?? []}
          />
        </div>
        <a
          target="_blank"
          href={`https://warpcast.com/${
            cast.author.username
          }/${cast.hash.substring(0, 10)}`}
        >
          <Button size="icon" variant="ghost" className="-mr-2.5">
            <ArrowUpRightFromSquare
              size={15}
              className="mt-0.5"
              strokeWidth={1.5}
              absoluteStrokeWidth
            />
          </Button>
        </a>
      </div>
    </div>
  );
};
