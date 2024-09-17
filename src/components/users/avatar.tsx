import Image from "next/image";

export const Avatar = (props: {
  pfpUrl?: string;
  size: "sm" | "md" | "lg" | "xl";
}) => {
  const pixelSize =
    props.size === "xl"
      ? 80
      : props.size === "lg"
      ? 40
      : props.size === "md"
      ? 24
      : 16;

  if (props.pfpUrl) {
    return (
      <div
        style={{
          width: pixelSize,
          height: pixelSize,
          borderWidth: 1,
          borderRadius: 999,
          borderColor: "#000000a",
          position: "relative",
        }}
      >
        <Image
          alt="pfp"
          style={{
            borderRadius: 999,
          }}
          objectFit="cover"
          objectPosition="center"
          src={props.pfpUrl}
          fill
        />
      </div>
    );
  } else {
    return (
      <div
        className="bg-gray-500"
        style={{
          width: pixelSize,
          height: pixelSize,
          borderWidth: 1,
          borderRadius: 999,
          borderColor: "#00000030",
        }}
      />
    );
  }
};
