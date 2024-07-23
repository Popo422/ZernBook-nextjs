"use client";
import Header from "@/app/components/Header";

import Post from "@/app/components/Post";
import UserPost from "@/app/components/UserPost";

import { useEffect, useState } from "react";

const User = ({ params }: { params: { id: string } }) => {
  const [posts, setPosts] = useState([]);
  const { id } = params;

  const fetchUserPosts = async (userId: string) => {
    try {
      const res = await fetch(`/api/post/${userId}`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUserPosts(id);
  }, [id]);

  return (
    <div className="w-full h-full overflow-auto">
      <Header page="user" />
      <div className="flex w-full pt-20 justify-center gap-20">
        <div className="flex flex-col gap-5">
          <UserPost fetchPosts={fetchUserPosts} />
          <ul className="flex flex-col gap-5">
            {posts &&
              posts.map((post: any) => (
                <Post
                  key={post.postId}
                  post={post}
                  fetchPosts={fetchUserPosts}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default User;
