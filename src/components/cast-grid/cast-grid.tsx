"use client";

import { CastWithInteractions as NeynarCast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Masonry } from "masonic";
import { useInView } from "react-intersection-observer";
import { Cast } from "../cast/cast";
import { useInfiniteQuery } from "@tanstack/react-query";
import { castSelect } from "@/utils/paginatedCastQuery";
import { useMemo, useRef } from "react";
import usePrevious from "@/hooks/usePrevious";
import { Skeleton } from "../ui/skeleton";
import GridLoader from "react-spinners/GridLoader";

export const CastGrid = (props: {
  //eslint-disable-next-line
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

  const itemsCount = castQuery.data?.length;
  const prevItemsCount = usePrevious(itemsCount);

  const removesCount = useRef(0);

  const gridKeyPostfix = useMemo(() => {
    if (!itemsCount || !prevItemsCount) return removesCount.current;
    if (itemsCount < prevItemsCount) {
      removesCount.current += 1;
      return removesCount.current;
    }

    return removesCount.current;
  }, [itemsCount, prevItemsCount]);

  if (castQuery.isLoading) {
    return <SkeletonGrid />;
  }

  if (!castQuery.data) {
    return <p>Empty List!</p>;
  }

  return (
    <div className="relative">
      <Masonry
        key={gridKeyPostfix}
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
      <div ref={ref} className="absolute left-0 w-full bottom-[500px]" />
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
    <Masonry
      overscanBy={1.5}
      maxColumnCount={4}
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
