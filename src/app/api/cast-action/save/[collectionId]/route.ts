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
      name: `Stash cast to ${collection.title}`,
      icon: "squirrel",
      description: `Stashes this cast to your collection: ${collection.title}`,
      aboutUrl: "https://caststash.com",
      action: {
        type: "post",
        postUrl: `https://caststash.com/api/cast-action/save/${collection.id}`,
      },
    },
    { status: 200 }
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  const { collectionId } = params;

  const body = await req.json();
  const result = await neynarClient.validateFrameAction(
    body.trustedData.messageBytes
  );

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
      link: "https://caststash.com",
    },
    { status: 200 }
  );
}
