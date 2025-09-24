import { currentDomain } from "@/utils/domain/getCurrentDomain";
import { neynarClient } from "@/utils/neynar";
import { prismaClient } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  const { collectionId } = params;

  const collection = await prismaClient.collections.findUniqueOrThrow({
    where: { id: collectionId },
  });

  return NextResponse.json(
    {
      name: `Stash cast`,
      icon: "squirrel",
      description: `Stash cast to ${collection.title}`,
      aboutUrl: "https://caststash.com",
      action: {
        type: "post",
        postUrl: `${currentDomain()}/api/cast-action/save/${collection.id}`,
      },
    },
    { status: 200 }
  );
}

// ("https://warpcast.com/~/add-cast-action?actionType=post&name=Followers&icon=person&postUrl=https%3A%2F%2F05d3-2405-201-800c-6a-70a7-56e4-516c-2d3c.ngrok-free.app%2Fapi%2Ffollowers");
// ("https://warpcast.com/~/add-cast-action?name=Stash+cast&icon=squirrel&description=Stashes+this+cast+to%3A+%3E%3E+vibes+%3C%3C&aboutUrl=https%3A%2F%2Fcaststash.com&actionType=post&postUrl=https%3A%2F%2Fcaststash.com%2Fapi%2Fcast-action%2Fsave%2F02d8bc4f-ebb6-4ef0-808d-a431d6a4f605");

export async function POST(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  const { collectionId } = params;

  const body = await req.json();
  const result = await neynarClient.validateFrameAction({
    messageBytesInHex: body.trustedData.messageBytes,
  });

  if (!result.valid) throw new Error("Not a valid signature!");

  const collection = await prismaClient.collections.findUniqueOrThrow({
    where: { id: collectionId },
  });

  if (result.action.interactor.fid !== collection.ownerFid) {
    return NextResponse.json(
      {
        message: "You don't have permission to save to this collection!",
      },
      { status: 403 }
    );
  }

  await await prismaClient.saved_casts.upsert({
    where: {
      castHash_collectionsId: {
        castHash: result.action.cast.hash,
        collectionsId: collectionId,
      },
    },
    create: {
      castHash: result.action.cast.hash,
      collectionId: {
        connect: {
          id: collectionId,
        },
      },
    },
    update: {
      deleted_at: null,
    },
  });

  return NextResponse.json(
    {
      type: "message",
      message: `Cast stashed to ${collection.title}`,
      link: `${currentDomain()}/~/profiles/${
        result.action.interactor.fid
      }/${collectionId}`,
    },
    { status: 200 }
  );
}
