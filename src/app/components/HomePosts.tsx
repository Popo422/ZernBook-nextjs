"use client";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import UserPost from "./UserPost";

const HomePosts = () => {
  const [posts, setPosts] = useState<any>([]);
  const fetchPosts = async () => {
    try {
      console.log("fetching posts");
      const response = await fetch("/api/post");
      const data = await response.json();
      setPosts(data.posts);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <UserPost fetchPosts={fetchPosts} />
      <ul className="flex flex-col gap-5">
        {posts &&
          posts.map((post: any) => (
            <Post key={post.postId} post={post} fetchPosts={fetchPosts} />
          ))}
      </ul>
    </>
  );
};

export default HomePosts;
