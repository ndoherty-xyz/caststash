import {
  EmbedCastId,
  EmbeddedCast,
  EmbedUrl,
} from "@neynar/nodejs-sdk/build/neynar-api/v2";
import Image from "next/image";
import { QuoteCast } from "./quote-cast";

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
        <p>test</p>
        <Image alt="" className="rounded-lg" fill src={props.embed.url} />
      </div>
    );
  }

  return <></>;
};

const CastEmbed = (props: { embed: EmbedCastId }) => {
  return <QuoteCast hash={props.embed.cast_id.hash} />;
};
