"use client";

import { CollectionGrid } from "@/components/collections/collection-grid";
import { ProfileHeader } from "@/components/profile/header";
import { UserLikes } from "@/components/profile/user-likes";
import { useAuth } from "@/hooks/useAuth";
import { getUserByUsername } from "@/utils/neynar/utils/getUser";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

export const Profile = () => {
  const auth = useAuth();
  const { username } = useParams<{ username: string }>();
  const [activeCollection, setActiveCollection] = useState<string>("likes");

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

  return (
    <div className="min-h-screen flex flex-col">
      <ProfileHeader
        activeCollection={activeCollection}
        selectCollection={setActiveCollection}
        user={userQuery.data}
      />
      <div className="p-6 bg-stone-100 flex-grow">
        {activeCollection === "likes" ? (
          <UserLikes fid={userQuery.data?.fid} />
        ) : (
          <CollectionGrid collectionId={activeCollection} />
        )}
      </div>
    </div>
  );
};
