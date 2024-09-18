"use client";

import { Profile } from "@/screens/profile";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { collectionId } = useParams<{
    username: string;
    collectionId: string;
  }>();

  return <Profile activeCollection={collectionId} />;
}
