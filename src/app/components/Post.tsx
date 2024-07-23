"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { BiTrash, BiUser, BiX } from "react-icons/bi";

const Post = ({ post, fetchPosts }: { post: any; fetchPosts: any }) => {
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
              <img src={user?.image} />
            ) : (
              <BiUser size={22} />
            )}
          </div>
          <span className="text-sm">{user?.name}</span>
        </div>
        <button
          className="btn btn-sm btn-circle btn-secondary"
          onClick={() => deleteModal.current && deleteModal.current.showModal()}
        >
          <BiTrash size={20} />
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{posts?.title}</h3>
        <p>{posts?.content}</p>
        {posts?.image && (
          <div className="flex justify-center p-2 border rounded-md border-dotted">
            <img src={posts?.image} className="w-[300px]" />
          </div>
        )}
      </div>
    </li>
  );
};

export default Post;
