import { NextResponse } from "next/server";
import { db } from "@/db/drizzle/db";
import { posts } from "@/db/drizzle/schema/posts";
import { eq } from "drizzle-orm";

export async function DELETE(request: Request) {
  try {
    const { postId } = await request.json();
    // Fetch posts with user details
    const fetchPost = await db
      .select()
      .from(posts)
      .where(eq(posts.postId, postId));
    if (fetchPost.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Post not found",
      });
    }
    await db.delete(posts).where(eq(posts.postId, postId));
    // Fetch image URLs concurrently

    return NextResponse.json({
      success: true,
      message: `Post ${postId} deleted successfully`,
    });
  } catch (e: Error | any) {
    console.error(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong: " + e.message,
    });
  }
}
