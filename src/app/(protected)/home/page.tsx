import Header from "@/app/components/Header";
import HomePosts from "@/app/components/HomePosts";
import UserPost from "@/app/components/UserPost";
import React from "react";

const Home = () => {
  return (
    <div className="w-full h-full overflow-auto">
      <Header />
      <div className="flex w-full pt-20 justify-center gap-20">
        <div className="flex flex-col gap-5">
          <UserPost />
          <HomePosts />
        </div>
      </div>
    </div>
  );
};

export default Home;
