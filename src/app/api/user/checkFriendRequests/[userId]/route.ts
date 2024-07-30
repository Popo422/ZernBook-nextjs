import { db } from "@/db/drizzle/db";
import { friends } from "@/db/drizzle/schema/friends";
import { users } from "@/db/drizzle/schema/users";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { NextApiRequest } from "next";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    //get queryString
    const { userId } = params;
    // validate email and password
    const friendRequests = await db
      .select()
      .from(friends)
      .innerJoin(users, eq(friends.userId, users.id))
      .where(and(eq(friends.friendId, userId), eq(friends.status, "pending")));

    return NextResponse.json({
      status: 200,
      friendRequests,
      message: "Friend requests fetched successfully",
    });
  } catch (e) {
    console.log({ e });
    return NextResponse.json({
      message: "Something went wrong",
      status: 500,
      error: e,
    });
  }
}
