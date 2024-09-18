import { ChannelCasts } from "@/components/cast-grid/channel-casts";

export default function Home() {
  return (
    <div className="p-6 bg-stone-100">
      <ChannelCasts channelId="someone-build" />
    </div>
  );
}
