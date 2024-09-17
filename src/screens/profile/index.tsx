"use client";

import { UserLikes } from "@/components/profile/user-likes";
import { Avatar } from "@/components/users/avatar";
import { useAuth } from "@/hooks/useAuth";
import { createNewCollection } from "@/utils/collections/createNew";
import { getUserByUsername } from "@/utils/neynar/utils/getUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const Profile = () => {
  const auth = useAuth();
  const { username } = useParams<{ username: string }>();

  const userQuery = useQuery({
    queryKey: ["userByUsername", username],
    queryFn: async () => {
      const user = await getUserByUsername(username, auth.state?.fid);
      return user;
    },
  });

  const createNewCollectionMutation = useMutation({
    mutationKey: ["createNewCollection"],
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
    <div className="p-6">
      <div className="flex flex-row gap-2 items-center">
        <Avatar pfpUrl={userQuery.data?.pfp_url} size="xl" />
        <h1 className="text-3xl font-bold">{userQuery.data?.display_name}</h1>

        {/* <button
          onClick={() => {
            createNewCollectionMutation.mutateAsync({
              title: "test collection",
            });
          }}
        >
          test create collection
        </button> */}
      </div>
      <div className="pt-6">
        {userQuery.data?.fid ? <UserLikes fid={userQuery.data?.fid} /> : null}
      </div>
    </div>
  );
};
