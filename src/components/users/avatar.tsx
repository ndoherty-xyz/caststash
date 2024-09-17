import Image from "next/image";

export const Avatar = (props: {
  pfpUrl?: string;
  size: "sm" | "md" | "lg" | "xl" | "2xl";
  noBorder?: boolean;
  className?: string;
}) => {
  const pixelSize =
    props.size === "2xl"
      ? 120
      : props.size === "xl"
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
          borderRadius: 999,
          ...(props.noBorder
            ? {}
            : {
                borderWidth: 1,

                borderColor: "#000000a",
              }),
          position: "relative",
        }}
        className={props.className}
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
        className={`bg-gray-500 ${props.className}`}
        style={{
          width: pixelSize,
          height: pixelSize,
          borderWidth: 1,
          borderRadius: 999,
          borderColor: "#000000a",
        }}
      />
    );
  }
};
