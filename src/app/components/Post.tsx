"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiMenu, BiTrash, BiUser, BiX } from "react-icons/bi";

const Post = ({ post, fetchPosts }: { post: any; fetchPosts: any }) => {
  const session = useSession();
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [isFriendAdded, setIsFriendAdded] = useState<boolean>(false);
  const router = useRouter();
  const deleteModal = useRef<HTMLDialogElement | null>(null);
  const { user, posts } = post;
  type PostType = {
    title: string;
    content: string;
    image: string;
  };
  const deletePost = async (postId: string) => {
    try {
      const res = await fetch("/api/post/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });
      fetchPosts();
      deleteModal?.current?.close();
    } catch (err) {
      console.log(err);
    }
  };

  const addUser = async () => {
    try {
      const userId = session.data?.user?.id;
      const friendId = user?.id;
      const res = await fetch("/api/user/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          friendId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFriendAdded(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const checkIfFriendIsAdded = async (friendId: string, userId: string) => {
    try {
      const res = await fetch("/api/user/checkStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          friendId,
        }),
      });
      const data = await res.json();
      const { friendStatus } = data;
      if (friendStatus) {
        const isFriendAdded = friendStatus.filter((friend: any) => {
          const { status } = friend;
          if (status === "accepted" || status === "pending") {
            return true;
          }
          return false;
        });
        if (isFriendAdded.length > 0) {
          setIsFriendAdded(true);
        }
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (session.status === "authenticated") {
      const userId = session.data?.user?.id || "";
      const friendId = user?.id || "";
      if (userId !== friendId) {
        checkIfFriendIsAdded(friendId, userId);
      }
    }
  }, [session]);

  return (
    <li
      className="card bg-base-100 w-full min-h-48 shadow-xl "
      key={posts?.postId}
    >
      <dialog ref={deleteModal} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Post?</h3>
          <p className="py-4">Are you sure you want to delete this post?</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
            <button
              className="btn btn-error"
              onClick={() => deletePost(posts?.postId)}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-5 ">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-base-200 hover:bg-primary cursor-pointer"
            onClick={() => {
              router.push(`/${user?.id}`);
            }}
          >
            {user && user.image ? (
              <>
                <img src={user?.image} />
                {imageLoading && <div className="skeleton h-32 w-full"></div>}
              </>
            ) : (
              <BiUser size={22} />
            )}
          </div>
          <span className="text-sm">{user?.name}</span>
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
            <BiMenu size={22} />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow gap-5 bg-black"
          >
            {session?.data?.user?.id !== user?.id && !isFriendAdded && (
              <li>
                <button
                  type="submit"
                  className="w-full btn btn-neutral btn-xs"
                  onClick={() => {
                    addUser();
                  }}
                >
                  Add User
                </button>
              </li>
            )}
            {session?.data?.user?.id === user?.id && (
              <li>
                <button
                  type="submit"
                  className="w-full btn btn-neutral btn-xs"
                  onClick={async () => {
                    deleteModal?.current?.showModal();
                  }}
                >
                  Delete post
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{posts?.title}</h3>
        <p>{posts?.content}</p>
        {posts?.image && (
          <div className="flex justify-center p-2 border rounded-md border-dotted">
            {imageLoading && <div className="skeleton h-32 w-full"></div>}
            <img
              src={posts?.image}
              className={`w-[300px] ${imageLoading ? "hidden" : ""}`}
              onLoad={(e) => {
                if (e.currentTarget) {
                  setImageLoading(false);
                }
              }}
            />
          </div>
        )}
      </div>
    </li>
  );
};

export default Post;
