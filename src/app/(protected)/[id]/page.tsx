"use client";
import FriendsWidget from "@/app/components/FriendsWidget";
import Header from "@/app/components/Header";
import Intro from "@/app/components/Intro";

import Post from "@/app/components/Post";
import UserNav from "@/app/components/UserNav";
import UserPhotos from "@/app/components/UserPhotos";
import UserPost from "@/app/components/UserPost";

import { useEffect, useState } from "react";

const User = ({ params }: { params: { id: string } }) => {
  const [posts, setPosts] = useState<[any]>([{}]);
  const [friends, setFriends] = useState<any>([]);
  const [currentMenu, setCurrentMenu] = useState<string>("posts");
  const [profile, setProfile] = useState({});
  const { id } = params;

  const fetchUserPosts = async (userId: string | undefined) => {
    try {
      const res = await fetch(`/api/post/${userId}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async (userId: string) => {
    try {
      const res = await fetch(`api/user/${userId}`, {
        method: "GET",
        cache: "no-store",
      });
      const user = await res.json();
      if (user) {
        setProfile((prev: any) => ({ ...prev, profileImage: user?.image }));
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchUserFriends = async (userId: string) => {
    try {
      const res = await fetch(`api/user/userFriends/${userId}`, {
        method: "GET",
        cache: "no-store",
      });
      const { userFriends } = await res.json();
      if (userFriends) {
        setFriends(userFriends);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserPosts(id);
    fetchUserFriends(id);
    fetchUser(id);
  }, [id]);

  return (
    <div className="w-full h-full overflow-auto">
      <Header page="user" />
      <UserNav
        profile={profile}
        friendsNo={friends.length || 0}
        currentMenu={currentMenu}
        setCurrentMenu={setCurrentMenu}
      />
      <div className="flex w-full py-20 justify-center gap-20 pb-20 h-full">
        <div className=" flex-col gap-5 hidden md:flex ">
          <Intro />
          <UserPhotos posts={posts} />
        </div>
        {currentMenu === "posts" && (
          <div className="flex flex-col gap-5 md:w-[500px] w-[300px] h-full">
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
        )}
        {currentMenu === "friends" && (
          <div className="flex flex-col gap-5 md:w-[500px] w-[300px] h-full">
            <FriendsWidget userFriends={friends} />
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
