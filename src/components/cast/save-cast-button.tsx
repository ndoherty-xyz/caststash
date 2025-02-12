import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "../ui/popover";
import { Bookmark, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserCollections } from "@/utils/collections/getUserCollection";
import { addCastToCollection } from "@/utils/collections/addCastToCollection";
import { useState } from "react";
import { removeCastFromCollection } from "@/utils/collections/removeCastFromCollection";
import { Button } from "../ui/button";

export const SaveCastButton = (props: {
  castHash: string;
  savedInCollections: string[];
  saveCount: number;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const auth = useAuth();

  const saveCastMutation = useMutation({
    mutationKey: ["saveCast", props.castHash],
    mutationFn: async (args: { collectionId: string }) => {
      if (!auth.state) return;
      return await addCastToCollection({
        fid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        castHash: props.castHash,
        collectionId: args.collectionId,
      });
    },
    onSuccess(_, args) {
      queryClient.invalidateQueries({
        queryKey: ["casts", "collection", args.collectionId],
      });
    },
    onMutate: ({ collectionId }) => {
      return {
        optimisticData: {
          object: "cast",
          hash: props.castHash,
          savedInCollectionIds: [collectionId, ...props.savedInCollections],
          saveCount: props.saveCount + 1,
        },
        rollbackData: {
          object: "cast",
          hash: props.castHash,
          savedInCollectionIds: props.savedInCollections,
          saveCount: props.saveCount,
        },
      };
    },
  });

  const removeCastMutation = useMutation({
    mutationKey: ["removeCast", props.castHash],
    mutationFn: async (args: { collectionId: string }) => {
      if (!auth.state) return;
      return await removeCastFromCollection({
        fid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        castHash: props.castHash,
        collectionId: args.collectionId,
      });
    },
    onSuccess(_, args) {
      queryClient.invalidateQueries({
        queryKey: ["casts", "collection", args.collectionId],
      });
    },
    onMutate: ({ collectionId }) => {
      return {
        optimisticData: {
          object: "cast",
          hash: props.castHash,
          savedInCollectionIds: props.savedInCollections.filter(
            (x) => x !== collectionId
          ),
          saveCount: props.saveCount - 1,
        },
        rollbackData: {
          object: "cast",
          hash: props.castHash,
          savedInCollectionIds: props.savedInCollections,
          saveCount: props.saveCount,
        },
      };
    },
  });

  const userCollectionsQuery = useQuery({
    queryKey: ["userCollections", auth.state?.fid],
    queryFn: async () => {
      if (!auth.state?.fid) return [];
      return await getUserCollections({ fid: auth.state.fid });
    },
    enabled: !!auth.state?.fid,
  });

  const isSavedAnywhere = props.savedInCollections.length > 0;

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <PopoverTrigger asChild className="cursor-pointer">
        <div className="flex flex-row gap-2 items-center justify-center">
          <Button size="icon" variant="ghost">
            {isSavedAnywhere ? (
              <Bookmark
                className="fill-foreground mt-0.5"
                size={16}
                strokeWidth={1.5}
                absoluteStrokeWidth
              />
            ) : (
              <Bookmark
                size={16}
                className="mt-0.5"
                strokeWidth={1.5}
                absoluteStrokeWidth
              />
            )}
          </Button>
          {props.saveCount ? (
            <p className={`font-semibold text-xs -ml-3 mt-0.5`}>
              {props.saveCount}
            </p>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end" alignOffset={-16}>
        {userCollectionsQuery.data?.map((collection, index) => {
          const isSavedIn = props.savedInCollections.includes(collection.id);
          return (
            <div
              key={collection.id}
              onClick={() => {
                if (isSavedIn) {
                  removeCastMutation.mutateAsync({
                    collectionId: collection.id,
                  });
                } else {
                  saveCastMutation.mutateAsync({ collectionId: collection.id });
                }

                setOpen(false);
              }}
              className={`px-2.5 py-2 border-stone-100 cursor-pointer hover:underline flex flex-row gap-2 items-center ${
                index !== userCollectionsQuery.data.length - 1 ? "border-b" : ""
              }`}
            >
              {isSavedIn ? (
                <Check size={16} />
              ) : isSavedAnywhere ? (
                <div className="w-4" />
              ) : null}
              <p className="text-sm font-medium">{collection.title}</p>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
