import {
  EmbedCastId,
  EmbeddedCast,
  EmbedUrl,
} from "@neynar/nodejs-sdk/build/neynar-api/v2";
import Image from "next/image";
import { QuoteCast } from "./quote-cast";
import Link from "next/link";

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
          key={props.embed.url}
          unoptimized
          alt=""
          className="rounded-lg standard-outline"
          style={{
            outlineWidth: 1,
          }}
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
          className="rounded-lg standard-outline bg-stone-200/25"
          style={{ width: "100%", aspectRatio, outlineWidth: 1 }}
          src={props.embed.url}
          controls
        />
      </div>
    );
  } else if (!!props.embed.metadata.html) {
    const image = props.embed.metadata.html.ogImage?.[0]?.url;
    const title = props.embed.metadata.html.ogTitle;
    const desc = props.embed.metadata.html.ogDescription;

    return (
      <Link target="_blank" href={props.embed.url}>
        <div
          className="flex flex-row standard-outline rounded-lg h-20 cursor-pointer"
          style={{
            outlineWidth: 1,
          }}
        >
          {image ? (
            <div
              style={{
                position: "relative",
                height: "100%",
                aspectRatio: 1,
              }}
            >
              <Image unoptimized alt="" objectFit="cover" fill src={image} />
            </div>
          ) : null}
          <div className="p-4 flex flex-col justify-center">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs line-clamp-2">{desc}</p>
          </div>
        </div>
      </Link>
    );
  }

  return <p>{props.embed.url}</p>;
};

const CastEmbed = (props: { embed: EmbedCastId }) => {
  return <QuoteCast hash={props.embed.cast_id.hash} />;
};
