//create a next api for creating a post

import { NextResponse } from "next/server";
import { db } from "@/db/drizzle/db";
import { posts } from "@/db/drizzle/schema/posts";
import { friends } from "@/db/drizzle/schema/friends";
import { users } from "@/db/drizzle/schema/users";
import { and, eq, or } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId, friendId } = await request.json();
    // validate email and password
    const checkIfFriendExists = await db
      .select()
      .from(users)
      .where(eq(users.id, friendId));

    if (!checkIfFriendExists || checkIfFriendExists.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Friend not found",
      });
    }

    const checkFriendStatus = await db
      .select()
      .from(friends)
      .where(
        or(
          and(eq(friends.userId, userId), eq(friends.friendId, friendId)),
          and(eq(friends.friendId, userId), eq(friends.userId, friendId))
        )
      )
      .limit(1);

    if (checkFriendStatus.length > 0) {
      const { status } = checkFriendStatus[0];
      if (status === "accepted" || status === "rejected") {
        return NextResponse.json({
          success: false,
          message: "Friend request already accepted or rejected",
        });
      }
      await db
        .update(friends)
        .set({ status: "rejected" })
        .where(
          and(
            eq(friends.friendId, userId),
            eq(friends.userId, friendId)
            // eq(friends.status, "pending")
          )
        );

      return NextResponse.json({
        success: true,
        message: "Friend request accepted",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Friend request not found",
      });
    }
  } catch (e: Error | any) {
    console.error(e);
    NextResponse.json({
      success: false,
      message: "Something went wrong" + e,
    });
  }
}
