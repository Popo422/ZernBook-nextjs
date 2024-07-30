import { db } from "@/db/drizzle/db";
import { friends } from "@/db/drizzle/schema/friends";
import { users } from "@/db/drizzle/schema/users";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, or } from "drizzle-orm";
import { NextApiRequest } from "next";

export async function POST(request: NextRequest) {
  try {
    //get queryString
    const { userId, friendId } = await request.json();
    // validate email and password
    const friendRequest = await db
      .select()
      .from(friends)
      .where(
        and(
          eq(friends.friendId, friendId),
          eq(friends.userId, userId),
          or(eq(friends.status, "pending"), eq(friends.status, "accepted"))
        )
      );
    return NextResponse.json({
      status: 200,
      friendRequest,
      message: "friend request fetched successfully",
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
