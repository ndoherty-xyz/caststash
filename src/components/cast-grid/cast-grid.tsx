"use client";

import { Cast as NeynarCast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Masonry } from "masonic";
import { useInView } from "react-intersection-observer";
import { Cast } from "../cast/cast";

export const CastGrid = (props: {
  fetchMore: () => void;
  data: NeynarCast[];
}) => {
  const { ref } = useInView({
    onChange: () => {
      props.fetchMore();
    },
  });

  return (
    <>
      <Masonry
        maxColumnCount={4}
        columnGutter={20}
        items={props.data}
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
