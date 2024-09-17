import { getCast } from "@/utils/neynar/utils/getCast";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "../users/avatar";

export const QuoteCast = (props: { hash: string }) => {
  const castQuery = useQuery({
    queryKey: ["cast", props.hash],
    queryFn: async ({ pageParam }) => {
      return await getCast({ castHash: props.hash });
    },
  });

  if (castQuery.isLoading) {
    return (
      <div
        style={{ height: 76 }}
        className="border rounded-lg border-[#000000a] p-2.5 flex flex-col gap-1.5"
      ></div>
    );
  }

  if (!castQuery.data) {
    return (
      <div
        style={{ height: 76 }}
        className="border rounded-lg border-[#000000a] p-2.5 flex flex-col gap-1.5"
      >
        <p>Error loading cast :(</p>
      </div>
    );
  }

  return (
    <a
      target="_blank"
      href={`https://warpcast.com/${
        castQuery.data?.author.username
      }/${props.hash.substring(0, 10)}`}
    >
      <div className="border rounded-lg border-[#000000a] p-2.5 flex flex-col gap-1.5">
        <div className="flex flex-row gap-2">
          <Avatar size="sm" pfpUrl={castQuery.data?.author.pfp_url} />
          <p className="text-xs font-bold">
            {castQuery.data?.author.display_name ??
              `@${castQuery.data?.author.username}`}
          </p>
        </div>
        <p className="text-xs line-clamp-2">{castQuery.data?.text}</p>
      </div>
    </a>
  );
};
