"use client";
import { useRef, useState } from "react";
import User from "./User";
import { BiCheck, BiEdit, BiImageAdd, BiUpload, BiX } from "react-icons/bi";
import { useSession } from "next-auth/react";
import Image from "next/image";

const UserPost = ({
  fetchPosts,
}: {
  fetchPosts: (userId: string | undefined) => Promise<void>;
}) => {
  const userId = useSession().data?.user?.id;
  type PostType = {
    title: string;
    content: string | null;
    image: {
      fileName: string;
      url: string;
    } | null;
  };
  const createPost = async (post: PostType) => {
    try {
      const { title, content, image } = post;
      await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          image: image?.fileName,
          userId,
        }),
      });
    } catch (err) {
      console.log({ err });
    }
  };
  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as File;
    try {
      setUploading(true);
      const buffer = Buffer.from(await file.arrayBuffer());
      const data = {
        name: file.name,
        image: buffer.toString("base64"),
        contentType: file.type,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_API}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      result &&
        setPost((prev) => ({
          ...prev,
          image: {
            fileName: result.fileName,
            url: result.url,
          },
        }));
      setUploading(false);
    } catch (err) {
      setUploading(false);
      console.log({ err });
    }
  };
  const [post, setPost] = useState<PostType>({
    title: "Post Title",
    content: null,
    image: null,
  });
  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [uploadImage, setUploadImage] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  //create a modal ref
  const user = useSession().data?.user;
  const modalRef = useRef<HTMLDialogElement | null>(null);
  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <figure className="overflow-auto">
        <div className="py-5 w-full flex gap-3 p-5">
          <button
            className="w-full"
            onClick={() => {
              modalRef.current && modalRef.current.showModal();
              blur();
            }}
          >
            <input
              placeholder="Type here"
              className="input  w-full text-black  bg-white "
              onChange={(e) =>
                setPost((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </button>
          <dialog id="my_modal_1" className="modal" ref={modalRef}>
            <div className="modal-box flex flex-col gap-5">
              <div className="modal-action flex pb-5">
                <div className="w-full flex justify-between items-center">
                  {editTitle ? (
                    <div className="flex gap-5">
                      <textarea
                        className="input input-bordered input-sm bg-white text-black"
                        placeholder="Post Title"
                        value={post && post.title}
                        onChange={(e) => {
                          setPost((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }));
                        }}
                      ></textarea>
                      <button
                        className="btn btn-circle bg-primary btn-sm"
                        onClick={() => setEditTitle(false)}
                      >
                        <BiCheck />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <span>{post && post.title}</span>
                      <div
                        className="btn btn-sm btn-circle"
                        onClick={() => {
                          setEditTitle(true);
                        }}
                      >
                        <BiEdit />
                      </div>
                    </div>
                  )}
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}

                    <button
                      className="btn btn-sm btn-circle btn-primary "
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadImage((prev) => !prev);
                      }}
                    >
                      <BiX size={10} />
                    </button>
                  </form>
                </div>
              </div>

              {uploadImage ? (
                <input
                  className="input bg-white text-black min-h-10"
                  placeholder="Whats on your mind "
                  value={(post && post.content) || ""}
                  onChange={(e) =>
                    setPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                ></input>
              ) : (
                <textarea
                  className="textarea textarea-bordered textarea-lg bg-white text-black"
                  placeholder="Whats on your mind "
                  value={(post && post.content) || ""}
                  onChange={(e) =>
                    setPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                />
              )}
              {uploadImage && !uploading && (
                <div className="w-full flex flex-col p-2 outline rounded-lg">
                  {/* Upload Area */}
                  <div className="flex w-full h-full bg-gray-500 rounded-lg relative">
                    <input
                      className="input w-full h-full hidden"
                      type="file"
                      id="uploadFile"
                      onChange={uploadPhoto}
                    ></input>
                    {post && post.image ? (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <button
                          className="absolute top-0 right-0 btn btn-primary btn-sm"
                          onClick={() =>
                            setPost((prev) => ({ ...prev, image: null }))
                          }
                        >
                          <BiX size={10} />
                        </button>
                        <img
                          alt="uploaded-photo"
                          src={post.image.url}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <button
                        className=" w-full flex items-center justify-center h-[200px]"
                        onClick={() => {
                          document.getElementById("uploadFile")?.click();
                        }}
                      >
                        <BiUpload />
                      </button>
                    )}
                    {uploadImage && (
                      <button
                        className="btn btn-primary btn-sm absolute top-0 right-0"
                        onClick={() => {
                          setUploadImage(false);
                        }}
                      >
                        <BiX size={10} />
                      </button>
                    )}
                  </div>
                </div>
              )}
              {uploading && <span className="loading loading-spinner "></span>}

              <div className="flex justify-end w-full">
                <button
                  className="btn btn-primary w-full"
                  onClick={async () => {
                    try {
                      const res = await createPost(post);
                      modalRef.current && modalRef.current.close();
                      fetchPosts(userId);
                    } catch (err) {
                      console.log({ err });
                    }
                  }}
                >
                  Post
                </button>
              </div>
              <div className="flex w-full p-3 justify-between relative">
                <button
                  className="btn  btn-circle btn-sm "
                  onClick={() => {
                    setUploadImage(true);
                  }}
                >
                  <BiImageAdd />
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </figure>
    </div>
  );
};

export default UserPost;
