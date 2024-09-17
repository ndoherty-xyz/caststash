import { CastGrid } from "@/components/cast-grid/cast-grid";
import { ChannelCasts } from "@/components/cast-grid/channel-casts";

export default function Home() {
  return (
    <div className="p-6">
      <ChannelCasts channelId="someone-build" />
    </div>
  );
}
