import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "../ui/popover";
import { Bookmark, BookmarkCheck, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserCollections } from "@/utils/collections/getUserCollection";
import { getCollectionCastHasBeenSavedByUser } from "@/utils/saved-casts/castSaveState";
import { addCastToCollection } from "@/utils/collections/addCastToCollection";
import { useState } from "react";
import { removeCastFromCollection } from "@/utils/collections/removeCastFromCollection";

export const SaveCastButton = (props: { castHash: string }) => {
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
        queryKey: ["castSavedIn", props.castHash],
      });
      queryClient.invalidateQueries({
        queryKey: ["collectionCasts", args.collectionId],
      });
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
        queryKey: ["castSavedIn", props.castHash],
      });
      queryClient.invalidateQueries({
        queryKey: ["collectionCasts", args.collectionId],
      });
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

  const castSaveStateQuery = useQuery({
    queryKey: ["castSavedIn", props.castHash],
    queryFn: async () => {
      if (!auth.state?.fid || !auth.state.signerUUID) return {};
      return await getCollectionCastHasBeenSavedByUser({
        fid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        castHash: props.castHash,
      });
    },
    enabled: !!auth.state?.fid && !!auth.state.signerUUID,
  });

  const isSavedAnywhere = Object.keys(castSaveStateQuery.data ?? []).length > 0;

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
        {userCollectionsQuery.data?.map((collection, index) => (
          <div
            key={collection.id}
            onClick={() => {
              if (!!castSaveStateQuery.data?.[collection.id]) {
                removeCastMutation.mutateAsync({ collectionId: collection.id });
              } else {
                saveCastMutation.mutateAsync({ collectionId: collection.id });
              }

              setOpen(false);
            }}
            className={`px-2.5 py-2 border-stone-100 cursor-pointer hover:underline flex flex-row gap-2 items-center ${
              index !== userCollectionsQuery.data.length - 1 ? "border-b" : ""
            }`}
          >
            {!!castSaveStateQuery.data?.[collection.id] ? (
              <Check size={16} />
            ) : isSavedAnywhere ? (
              <div className="w-4" />
            ) : null}
            <p className="text-sm font-medium">{collection.title}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
