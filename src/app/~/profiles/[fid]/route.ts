import { getUserByFid } from "@/utils/neynar/utils/getUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { fid: string } }
) {
  try {
    const { fid } = params;
    const fidNum = Number(fid);

    const user = await getUserByFid(fidNum);

    return NextResponse.redirect(new URL(`/${user.username}`, request.url));
  } catch {
    //Error handling code
    return NextResponse.redirect(new URL("/", request.url));
  }
}
