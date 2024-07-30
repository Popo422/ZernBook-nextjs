"use client";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import UserPost from "./UserPost";

const HomePosts = () => {
  const [posts, setPosts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/post");
      const data = await response.json();
      if (data.success) {
        setLoading(false);
        setPosts(data.posts);
      }
      setLoading(false);
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
