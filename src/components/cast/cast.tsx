"use client";

import { CastWithInteractions as NeynarCast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Avatar } from "../users/avatar";
import { Embed } from "./embed";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { addCastToCollection } from "@/utils/collections/addCastToCollection";
import Link from "next/link";
import { Bookmark, Heart, HeartOff } from "lucide-react";

export const Cast = ({ cast }: { cast: NeynarCast }) => {
  const auth = useAuth();

  const saveCastMutation = useMutation({
    mutationKey: ["saveCast", cast.hash],
    mutationFn: async () => {
      if (!auth.state) return;
      return await addCastToCollection({
        fid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        castHash: cast.hash,
        collectionId: "b5ef6dd5-5377-4f1b-846a-469f34a64e36",
      });
    },
  });

  return (
    <div className="flex flex-col gap-2 break-words bg-white rounded-2xl p-4 border border-[#0000000a]">
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
        <Embed embed={x} />
      ))}

      <div className="flex flex-row pt-3 w-full items-center justify-between gap-2">
        <div className="flex flex-row gap-1">
          <Heart
            size={20}
            {...(cast.viewer_context?.liked
              ? { fill: "#ef4444", stroke: "#ef4444" }
              : {})}
          />
        </div>
        <button
          onClick={() => {
            saveCastMutation.mutateAsync();
          }}
        >
          <Bookmark size={20} />
        </button>
      </div>
    </div>
  );
};
