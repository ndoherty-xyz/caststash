"use client";

import { CastWithInteractions as NeynarCast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Masonry } from "masonic";
import { useInView } from "react-intersection-observer";
import { Cast } from "../cast/cast";
import { useInfiniteQuery } from "@tanstack/react-query";
import { castSelect } from "@/utils/paginatedCastQuery";

export const CastGrid = (props: {
  queryKey: any[];
  queryFn: ({
    pageParam,
  }: {
    pageParam: string;
  }) => Promise<{ casts: NeynarCast[]; cursor?: string | undefined }>;
}) => {
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        castQuery.fetchNextPage();
      }
    },
  });

  const castQuery = useInfiniteQuery({
    queryKey: props.queryKey,
    queryFn: props.queryFn,
    initialPageParam: "",
    getNextPageParam(lastPage) {
      console.log(lastPage.cursor);
      return lastPage.cursor;
    },
    select: castSelect,
  });

  console.log("castgrid re-rendering");

  if (!castQuery.data) {
    return <p>Empty List!</p>;
  }

  return (
    <>
      <Masonry
        overscanBy={1.5}
        maxColumnCount={4}
        columnGutter={20}
        items={castQuery.data ?? []}
        render={({
          data,
        }: {
          index: number;
          data: NeynarCast;
          width: number;
        }) => {
          return <Cast cast={data} />;
        }}
      />
      <div ref={ref} />
    </>
  );
};
