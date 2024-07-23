import { NextResponse } from "next/server";
import { db } from "@/db/drizzle/db";
import { posts } from "@/db/drizzle/schema/posts";
import { users } from "@/db/drizzle/schema/users";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Fetch posts with user details
    const fetchPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.userId, params.userId))
      .innerJoin(users, eq(posts.userId, users.id));

    // Fetch image URLs concurrently
    const allPosts = await Promise.all(
      fetchPosts.map(async (post) => {
        const image = post.posts.image;
        if (!image) return { posts: post.posts, user: post.user };
        const fetchImage = await fetch(
          `${process.env.NEXT_PUBLIC_UPLOAD_API}/upload/?fileName=${image}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { url } = await fetchImage.json();
        return {
          posts: {
            ...post.posts,
            image: image ? url : null,
          },
          user: post.user,
        };
      })
    );

    return NextResponse.json({
      success: true,
      posts: allPosts,
      message: "Fetched all posts",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong: " + e.message,
    });
  }
}
