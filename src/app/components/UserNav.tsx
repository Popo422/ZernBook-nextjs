"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BiCamera, BiUser } from "react-icons/bi";

const UserNav = ({ profile, currentMenu, setCurrentMenu, friendsNo }: any) => {
  const { coverPhoto, name, image } = profile;
  const session = useSession();
  return (
    <div className="w-full flex flex-col gap-1 justify-center">
      <div className="w-full flex justify-center">
        {/* Cover Photo */}
        <div className="w-full h-[600px] bg flex  bg-base-300 flex-col items-center relative">
          <img
            src={"https://picsum.photos/2000/300"}
            className="w-[70%] h-[420px]"
          />
          <div className="w-[70svw] px-10 flex flex-col md:flex-row z-10 absolute bottom-10 gap-10 items-center">
            {/* Photo */}
            <div className="w-fit p-2 rounded-full relative avatar bg-base-300">
              {" "}
              <div className=" rounded-full  h-40 w-40 flex items-center justify-center">
                <img src={session?.data?.user?.image} />
              </div>
              <div className=" absolute z-10  bottom-0 right-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border">
                  <BiCamera />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              {session?.data?.user?.image === null && (
                <div className="skeleton h-12 w-full"></div>
              )}
              <span className="text-2xl font-bold">
                {session?.data?.user?.name}
              </span>

              <span>{friendsNo} Friends</span>
            </div>
          </div>
        </div>
      </div>
      <div className="divider divider-vertical w-full divider-neutral px-10"></div>
      <div className="w-full flex justify-center">
        <ul className="w-[70svw]  flex justify-start gap-10 px-10">
          <li
            className={`flex flex-col items-center hover:bg-base-200 p-2 rounded-md cursor-pointer`}
            onClick={() => setCurrentMenu("posts")}
          >
            <span
              className={`${
                currentMenu === "posts"
                  ? "font-bold text-primary border-primary border-b-2"
                  : ""
              }`}
            >
              Posts
            </span>
          </li>
          <li
            className={`flex flex-col items-center hover:bg-base-200 p-2 rounded-md cursor-pointer`}
            onClick={() => setCurrentMenu("friends")}
          >
            <span
              className={`${
                currentMenu === "friends"
                  ? "font-bold text-primary border-primary border-b-2"
                  : ""
              }`}
            >
              Friends
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserNav;
