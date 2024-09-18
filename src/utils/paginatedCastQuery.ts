import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export const castSelect = (data: {
  pages: Array<{ casts: CastWithInteractions[]; cursor?: string | undefined }>;
}) => {
  return data.pages.map((x) => x.casts).flat();
};
