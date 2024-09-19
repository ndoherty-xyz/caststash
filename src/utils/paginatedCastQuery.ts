import { NeynarCastWithSaveState } from "./saved-casts/types";

export const castSelect = (data: {
  pages: Array<{
    casts: NeynarCastWithSaveState[];
    cursor?: string | undefined;
  }>;
}) => {
  return data.pages.map((x) => x.casts).flat();
};
