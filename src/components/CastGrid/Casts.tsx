"use client";

import { getSomeoneBuildChannelCasts } from "@/utils/neynar/utils/getChannelCasts";
import { Cast as NeynarCast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Masonry } from "masonic";
import { useInView } from "react-intersection-observer";
import { Cast } from "../cast/cast";

export const Casts = () => {
  const { ref } = useInView({
    onChange: () => {
      castQuery.fetchNextPage();
    },
  });

  const castQuery = useInfiniteQuery({
    queryKey: ["casts"],
    queryFn: async ({ pageParam }) => {
      const { casts, cursor } = await getSomeoneBuildChannelCasts({
        cursor: pageParam,
      });

      return {
        casts,
        cursor,
      };
    },
    initialPageParam: "",
    getNextPageParam(lastPage) {
      console.log(lastPage.cursor);
      return lastPage.cursor;
    },
  });

  const allCasts = castQuery.data?.pages.map((x) => x.casts).flat() ?? [];
  return (
    <>
      <Masonry
        maxColumnCount={4}
        columnGutter={20}
        items={allCasts}
        render={TestComponent}
      />
      <div ref={ref} />
    </>
  );
};

const TestComponent = ({
  index,
  data,
  width,
}: {
  index: number;
  data: NeynarCast;
  width: number;
}) => {
  return <Cast cast={data} />;
};
