import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Avatar } from "../users/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUserCollections } from "@/utils/collections/getUserCollection";
import {
  DeleteCollectionModal,
  EditCollectionModal,
  NewCollectionModal,
} from "./new-collection-modal";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { collections } from "@/utils/prisma";

export const ProfileHeader = (props: {
  user: User;
  activeCollection: string;
}) => {
  const { username } = useParams<{ username: string }>();
  const auth = useAuth();
  const router = useRouter();

  const userCollectionsQuery = useQuery({
    queryKey: ["userCollections", props.user.fid],
    queryFn: async () => {
      return await getUserCollections({ fid: props.user.fid });
    },
  });

  const activeCollectionObj: collections | undefined =
    userCollectionsQuery.data?.find((x) => x.id === props.activeCollection);

  return (
    <div className="flex flex-col items-center bg-white dark:bg-stone-950 min-h-full">
      <div className="flex flex-col items-center py-8 gap-1">
        <Avatar pfpUrl={props.user.pfp_url} size="2xl" />

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

      <div className="flex w-full flex-row border-y border-stone-300/25 dark:border-stone-400/25 py-1.5 overflow-x-scroll pl-3 sm:pl-6 no-scrollbar">
        {auth.state?.fid === props.user.fid ? <NewCollectionModal /> : null}
        <Link href={`/${username}`} scroll={false}>
          <Button
            className="m-1 ml-0"
            variant={props.activeCollection === "likes" ? "outline" : "ghost"}
          >
            Likes
          </Button>
        </Link>
        {userCollectionsQuery.data?.map((collection) => {
          return (
            <Link
              key={collection.id}
              href={`/${username}/${collection.id}`}
              scroll={false}
            >
              <Button
                className="m-1 ml-0"
                variant={
                  props.activeCollection === collection.id ? "outline" : "ghost"
                }
              >
                {collection.title}
              </Button>
            </Link>
          );
        })}
      </div>

      {activeCollectionObj ? (
        <div className="flex w-full flex-row justify-between gap-12 items-center border-y border-stone-300/25 dark:border-stone-400/25 py-4 px-6">
          <div className="flex-col gap-1">
            <p className="font-semibold">{activeCollectionObj.title}</p>
            {activeCollectionObj.description ? (
              <p className="text-sm text-stone-950/60 dark:text-stone-50/60">
                {activeCollectionObj.description}
              </p>
            ) : null}
          </div>
          {auth.state?.fid === props.user.fid ? (
            <div className="flex flex-row gap-2 items-center">
              <EditCollectionModal collection={activeCollectionObj} />
              <DeleteCollectionModal
                collection={activeCollectionObj}
                onSuccess={() => router.replace(`/${username}`)}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
