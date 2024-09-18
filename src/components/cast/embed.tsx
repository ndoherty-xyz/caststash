import {
  EmbedCastId,
  EmbeddedCast,
  EmbedUrl,
} from "@neynar/nodejs-sdk/build/neynar-api/v2";
import Image from "next/image";
import { QuoteCast } from "./quote-cast";

type NeynarVideoTypeFix = {
  streams: { height_px?: number; width_px: number }[];
};

export const Embed = (props: { embed: EmbeddedCast }) => {
  if ("cast_id" in props.embed) {
    return <CastEmbed embed={props.embed as EmbedCastId} />;
  } else {
    return <UrlEmbed embed={props.embed as EmbedUrl} />;
  }
};

const UrlEmbed = (props: { embed: EmbedUrl }) => {
  if (!props.embed.metadata) return null;

  if (props.embed.metadata.image) {
    // Image case
    const { height_px, width_px } = props.embed.metadata.image;
    const aspectRatio =
      width_px && height_px ? width_px / height_px : undefined;

    return (
      <div
        style={{
          width: "100%",
          position: "relative",
          height: "auto",
          aspectRatio,
        }}
      >
        <Image
          unoptimized
          alt=""
          className="rounded-lg"
          fill
          src={props.embed.url}
        />
      </div>
    );
  } else if (
    !!props.embed.metadata.video &&
    !!(props.embed.metadata.video as NeynarVideoTypeFix).streams[0]
  ) {
    // Video case
    const { height_px, width_px } = (
      props.embed.metadata.video as NeynarVideoTypeFix
    ).streams[0];
    const aspectRatio =
      width_px && height_px ? width_px / height_px : undefined;

    return (
      <div
        style={{
          width: "100%",
          position: "relative",
          height: "auto",
          aspectRatio,
        }}
      >
        <video
          style={{ width: "100%", aspectRatio }}
          className="rounded-lg"
          src={props.embed.url}
          controls
        />
      </div>
    );
  }

  return <></>;
};

const CastEmbed = (props: { embed: EmbedCastId }) => {
  return <QuoteCast hash={props.embed.cast_id.hash} />;
};
