"use client";

import Header from "@/app/components/Header";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiKey, BiLogoGmail } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";

const Login = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      redirect("/home");
    }
  }, [session]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      setTimeout(() => {
        setLoading(false);
        router.push("/home");
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 w-full h-full flex flex-col">
      <Header />

      <div className="w-full h-full items-center justify-center flex flex-col">
        {loading && (
          <span className="loading loading-spinner loading-lg"></span>
        )}
        <form
          className={`flex flex-col w-full items-center justify-center gap-6 ${
            loading ? "hidden" : ""
          }`}
          onSubmit={handleSubmit}
        >
          <label className="input input-bordered flex items-center gap-2">
            <BiLogoGmail size={22} />
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <BiKey size={22} />
            <input type="password" className="grow" name="password" />
          </label>

          <button className="p-3 btn btn-neutral">Sign In</button>
        </form>
        <div className="w-32 py-5 px-3 flex items-center justify-center">
          {" "}
          <button
            className="btn btn-primary"
            onClick={async () => {
              try {
                setLoading(true);
                await signIn("google");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <BsGoogle size={22} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
