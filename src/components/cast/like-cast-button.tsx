import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";
import { Button } from "../ui/button";
import { likeCast, unlikeCast } from "@/utils/neynar/utils/likeCast";
import { useState } from "react";

export const LikeCastButton = (props: {
  castHash: string;
  viewerContext: NeynarCastWithSaveState["viewer_context"];
  likeCount: number;
}) => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  const [hover, setHover] = useState<boolean>(false);

  const likeCastMutation = useMutation({
    mutationKey: ["unlikeCast", props.castHash],
    mutationFn: async (args: { castHash: string }) => {
      if (!auth.state) return;
      return await likeCast({
        userFid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        castHash: args.castHash,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["casts", "likes", auth.state?.fid],
      });
    },
    onMutate: ({ castHash }) => {
      return {
        optimisticData: {
          object: "cast",
          hash: castHash,
          viewer_context: {
            liked: true,
            recasted: false,
          },
          reactions: {
            likes_count: props.likeCount + 1,
          },
        },
        rollbackData: {
          object: "cast",
          hash: castHash,
          viewer_context: props.viewerContext,
          reactions: {
            likes_count: props.likeCount,
          },
        },
      };
    },
  });

  const unlikeCastMutation = useMutation({
    mutationKey: ["unlikeCast", props.castHash],
    mutationFn: async (args: { castHash: string }) => {
      if (!auth.state) return;
      return await unlikeCast({
        userFid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        castHash: args.castHash,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["casts", "likes", auth.state?.fid],
      });
    },
    onMutate: ({ castHash }) => {
      return {
        optimisticData: {
          object: "cast",
          hash: castHash,
          viewer_context: {
            liked: false,
            recasted: false,
          },
          reactions: {
            likes_count: props.likeCount - 1,
          },
        },
        rollbackData: {
          object: "cast",
          hash: castHash,
          viewer_context: props.viewerContext,
          reactions: {
            likes_count: props.likeCount,
          },
        },
      };
    },
  });

  return (
    <div className="flex flex-row gap-2 items-center justify-center">
      <Button
        size="icon"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        variant="ghost"
        className="hover:bg-red-100 dark:hover:bg-red-950"
        onClick={
          props.viewerContext?.liked
            ? () => unlikeCastMutation.mutateAsync({ castHash: props.castHash })
            : () => likeCastMutation.mutateAsync({ castHash: props.castHash })
        }
      >
        <Heart
          absoluteStrokeWidth
          strokeWidth={1.5}
          className={`mt-0.5 ${hover ? "text-red-500" : ""}`}
          size={16}
          {...(props.viewerContext?.liked
            ? { fill: "#ef4444", stroke: "#ef4444" }
            : {})}
        />
      </Button>
      {props.likeCount ? (
        <p
          className={`font-semibold text-xs -ml-3 mt-0.5 ${
            hover || props.viewerContext?.liked ? "text-red-500" : ""
          }`}
        >
          {props.likeCount}
        </p>
      ) : null}
    </div>
  );
};
