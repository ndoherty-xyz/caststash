"use client";

import { Cast } from "../cast/cast";
import { useInfiniteQuery } from "@tanstack/react-query";
import { castSelect } from "@/utils/paginatedCastQuery";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import GridLoader from "react-spinners/GridLoader";
import { NeynarCastWithSaveState } from "@/utils/saved-casts/types";
import { CustomMasonry } from "../custom-masonry";

export const CastGrid = (props: {
  hideChannelTag?: boolean;
  //eslint-disable-next-line
  queryKey: any[];
  queryFn: ({ pageParam }: { pageParam: string }) => Promise<{
    casts: NeynarCastWithSaveState[];
    cursor?: string | undefined;
  }>;
}) => {
  const castQuery = useInfiniteQuery({
    queryKey: props.queryKey,
    queryFn: props.queryFn,
    initialPageParam: "",
    getNextPageParam(lastPage) {
      return lastPage.cursor;
    },
    select: castSelect,
  });

  if (castQuery.isLoading) {
    return <SkeletonGrid />;
  }

  if (!castQuery.data) {
    return <p>Empty List!</p>;
  }

  return (
    <div className="relative">
      <CustomMasonry
        fetchMore={() => {
          castQuery.fetchNextPage();
        }}
        scrollFps={6}
        overscanBy={3}
        maxColumnCount={3}
        columnGutter={20}
        items={castQuery.data ?? []}
        render={({
          data,
          index,
        }: {
          index: number;
          data: NeynarCastWithSaveState;
          width: number;
        }) => {
          return (
            <Cast
              key={`${data.hash}-${index}`}
              cast={data}
              hideChannelTag={props.hideChannelTag}
            />
          );
        }}
      />
      {/* <div ref={ref} className="absolute left-0 w-full bottom-[500px]" /> */}
      {castQuery.isLoading || castQuery.isFetchingNextPage ? (
        <div className="py-8 w-full flex justify-center items-center">
          <GridLoader color="#00000030" />
        </div>
      ) : null}
    </div>
  );
};

export const SkeletonGrid = () => {
  // generate a list of random heights
  const heights = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      height: Math.floor(Math.random() * 300 + 150),
    }));
  }, []);

  return (
    <CustomMasonry
      overscanBy={2}
      maxColumnCount={3}
      columnGutter={20}
      items={heights}
      render={({
        data,
      }: {
        index: number;
        data: { height: number };
        width: number;
      }) => {
        return <Skeleton className="w-full" style={{ height: data.height }} />;
      }}
    />
  );
};
