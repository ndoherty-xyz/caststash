"use server";

import { neynarClient } from "..";

export const requireValidSigner = async (
  signerUUID: string,
  fidToVerify: number
) => {
  const res = await neynarClient.lookupSigner({ signerUuid: signerUUID });

  if (res.status !== "approved" || res.fid !== fidToVerify) {
    throw new Error(
      `Not a valid signer uuid and fid combo: fid:${fidToVerify} signerUUID:${signerUUID}`
    );
  }
};
