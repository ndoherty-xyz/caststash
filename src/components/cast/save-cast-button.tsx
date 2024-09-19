import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "../ui/popover";
import { Bookmark, BookmarkCheck, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserCollections } from "@/utils/collections/getUserCollection";
import { addCastToCollection } from "@/utils/collections/addCastToCollection";
import { useState } from "react";
import { removeCastFromCollection } from "@/utils/collections/removeCastFromCollection";

export const SaveCastButton = (props: {
  castHash: string;
  savedInCollections: string[];
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
          name: [collectionId, ...props.savedInCollections],
        },
        rollbackData: {
          object: "cast",
          hash: props.castHash,
          name: props.savedInCollections,
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
        },
        rollbackData: {
          object: "cast",
          hash: props.castHash,
          savedInCollectionIds: props.savedInCollections,
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
        {isSavedAnywhere ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
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
