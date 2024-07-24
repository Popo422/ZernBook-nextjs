//create a next api for creating a post

import { NextResponse } from "next/server";
import { db } from "@/db/drizzle/db";
import { posts } from "@/db/drizzle/schema/posts";

export async function POST(request: Request) {
  try {
    const { title, content, image, userId } = await request.json();
    // validate email and password
    const post = await db.insert(posts).values({
      postId: crypto.randomUUID(),
      title: title || "", 
      content: content || "",
      image,
      userId,
    });

    return NextResponse.json({
      success: true,
      post,
      message: "Post created successfully",
    });
  } catch (e : Error | any) {
    console.error(e);
    NextResponse.json({
      success: false,
      message: "Something went wrong" + e,
    });
  }
}
