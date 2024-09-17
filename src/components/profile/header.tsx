import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Avatar } from "../users/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewCollection } from "@/utils/collections/createNew";
import { getUserCollections } from "@/utils/collections/getUserCollection";

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
    <div className="flex flex-col items-center">
      <div className="bg-black w-full h-48" />
      <div
        className="flex flex-col items-center pb-6"
        style={{ marginTop: -50 }}
      >
        <div
          className="bg-white p-2.5 rounded-full aspect-square"
          style={{ width: 100, height: 100 }}
        >
          <Avatar noBorder pfpUrl={props.user.pfp_url} size="xl" />
        </div>

        <div className="text-center flex flex-col items-center gap-1">
          <h1 className="text-3xl font-bold">{props.user.display_name}</h1>
          <div className="px-2.5 py-1 rounded-full bg-stone-100 items-center flex justify-center">
            <h6 className="text-xs text-stone-600 -mt-0.5">
              @{props.user.username}
            </h6>
          </div>
          {props.user.profile.bio.text ? (
            <p className="max-w-80 pt-3 text-sm">
              {props.user.profile.bio.text}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-row border-t border-[#000000a] ">
        {auth.state?.fid === props.user.fid ? (
          <button
            onClick={() => {
              createNewCollectionMutation.mutateAsync({
                title: "test collection",
              });
            }}
            className="text-blue-400 py-2 pl-6 pr-4"
          >
            + New
          </button>
        ) : null}
        <div
          className={`py-2 px-4 cursor-pointer ${
            props.activeCollection === "likes"
              ? "border-b-2 border-black font-bold"
              : ""
          }`}
          onClick={() => props.selectCollection("likes")}
        >
          <p>Likes</p>
        </div>
        {userCollectionsQuery.data?.map((collection) => {
          return (
            <div
              className={`py-2 px-4 cursor-pointer ${
                props.activeCollection === collection.id
                  ? "border-b-2 border-black font-bold"
                  : ""
              }`}
              onClick={() => props.selectCollection(collection.id)}
            >
              <p>{collection.title}</p>
            </div>
          );
        })}
      </div>

      {/*  */}
    </div>
  );
};
