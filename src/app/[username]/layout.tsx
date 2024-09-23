"use client";

import { ProfileHeader } from "@/components/profile/header";
import { useAuth } from "@/hooks/useAuth";
import { getUserByUsername } from "@/utils/neynar/utils/getUser";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = useAuth();
  const { username, collectionId } = useParams<{
    username: string;
    collectionId: string;
  }>();

  const activeCollection = collectionId ? collectionId : "likes";

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
        user={userQuery.data}
      />
      <div className="p-3 sm:p-6 bg-stone-100 flex-grow dark:bg-stone-950">
        {children}
      </div>
    </div>
  );
}
