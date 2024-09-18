"use client";

import { CollectionGrid } from "@/components/collections/collection-grid";
import { UserLikes } from "@/components/profile/user-likes";
import { useAuth } from "@/hooks/useAuth";
import { getUserByUsername } from "@/utils/neynar/utils/getUser";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const Profile = (props: { activeCollection: string }) => {
  const auth = useAuth();
  const { username } = useParams<{ username: string }>();

  const userQuery = useQuery({
    queryKey: ["userByUsername", username],
    queryFn: async () => {
      const user = await getUserByUsername(username, auth.state?.fid);
      return user;
    },
  });

  if (userQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (!userQuery.data) {
    return <p>Something went wrong :(</p>;
  }

  return props.activeCollection === "likes" ? (
    <UserLikes fid={userQuery.data?.fid} />
  ) : (
    <CollectionGrid collectionId={props.activeCollection} />
  );
};
