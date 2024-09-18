import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Avatar } from "../users/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewCollection } from "@/utils/collections/createNew";
import { getUserCollections } from "@/utils/collections/getUserCollection";
import { NewCollectionModal } from "./new-collection-modal";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const ProfileHeader = (props: {
  user: User;
  activeCollection: string;
  selectCollection: (collectionId: string) => void;
}) => {
  const auth = useAuth();
  const queryClient = useQueryClient();

  const userCollectionsQuery = useQuery({
    queryKey: ["userCollections", props.user.fid],
    queryFn: async () => {
      return await getUserCollections({ fid: props.user.fid });
    },
  });

  const createNewCollectionMutation = useMutation({
    mutationKey: ["createNewCollection"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userCollections", props.user.fid],
      });
    },
    mutationFn: async (args: { title: string; description?: string }) => {
      if (!auth.state) return;

      const newCollection = await createNewCollection({
        fid: auth.state.fid,
        signerUUID: auth.state.signerUUID,
        title: args.title,
        description: args.description,
      });

      return newCollection;
    },
  });

  return (
    <div className="flex flex-col items-center bg-white min-h-full">
      <div className="flex flex-col items-center pb-8 pt-6 gap-1">
        <Avatar pfpUrl={props.user.pfp_url} size="xl" />

        <div className="text-center flex flex-col items-center gap-0.5">
          <h1 className="text-3xl font-bold">{props.user.display_name}</h1>
          <Badge variant="secondary">@{props.user.username}</Badge>
          {props.user.profile.bio.text ? (
            <p className="max-w-80 pt-3 text-sm">
              {props.user.profile.bio.text}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-row border-y border-stone-300/25 py-1.5 overflow-x-scroll pl-6">
        {auth.state?.fid === props.user.fid ? <NewCollectionModal /> : null}
        <Button
          className="m-1 ml-0"
          onClick={() => props.selectCollection("likes")}
          variant={props.activeCollection === "likes" ? "outline" : "ghost"}
        >
          Likes
        </Button>
        {userCollectionsQuery.data?.map((collection) => {
          return (
            <Button
              className="m-1 ml-0"
              onClick={() => props.selectCollection(collection.id)}
              variant={
                props.activeCollection === collection.id ? "outline" : "ghost"
              }
            >
              {collection.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
