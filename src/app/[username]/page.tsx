"use client";

import { Avatar } from "@/components/users/avatar";
import { useAuth } from "@/hooks/useAuth";
import { createNewCollection } from "@/utils/collections/createNew";
import { getUserByUsername } from "@/utils/neynar/utils/getUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function Profile() {
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
      <Avatar pfpUrl={userQuery.data?.pfp_url} size="xl" />
      <p>{userQuery.data?.display_name}</p>

      <button
        onClick={() => {
          createNewCollectionMutation.mutateAsync({
            title: "test collection",
          });
        }}
      >
        test create collection
      </button>
    </div>
  );
}
