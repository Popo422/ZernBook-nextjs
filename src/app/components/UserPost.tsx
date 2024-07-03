"use client";
import { useState } from "react";
import User from "./User";

const UserPost = () => {
  type PostType = {
    message: string;
    type: "text" | "image";
  };

  const [post, setPost] = useState<PostType>();
  return (
    <div className="card bg-base-100 w-[500px] shadow-xl">
      <figure>
        <div className="py-5 w-full flex gap-3 p-5">
          <User />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full text-black  bg-white"
          />
        </div>
      </figure>
      <div className="card-body">
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Post</button>
        </div>
      </div>
    </div>
  );
};

export default UserPost;
