import { db } from "@/db/drizzle/db";
import { friends } from "@/db/drizzle/schema/friends";
import { users } from "@/db/drizzle/schema/users";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, not, or } from "drizzle-orm";
import { NextApiRequest } from "next";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    //get queryString
    const { userId } = params;
    // validate email and password
    const userFriends = await db
      .select()
      .from(friends)
      .innerJoin(
        users,
        or(eq(friends.friendId, users.id), eq(friends.userId, users.id))
      )
      .where(
        and(
          eq(friends.status, "accepted"),
          or(eq(friends.friendId, userId), eq(friends.userId, userId)),
          not(eq(users.id, userId))
        )
      );

    return NextResponse.json({
      status: 200,
      userFriends,
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
