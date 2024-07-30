"use client";
import Header from "@/app/components/Header";
import HomePosts from "@/app/components/HomePosts";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const session = useSession();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      redirect("/login");
    }
  });
  return (
    <div className="w-full h-full overflow-auto">
      <Header page="home" />
      <div className="flex w-full md:w-full pt-20 justify-center gap-20">
        <div className="flex flex-col gap-5 md:w-[500px] w-[300px]">
          <HomePosts />
        </div>
      </div>
    </div>
  );
};

export default Home;
