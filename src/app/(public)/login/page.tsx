import Header from "@/app/components/Header";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

import React from "react";
import { BiKey, BiLogoGmail } from "react-icons/bi";

const Login = () => {
  return (
    <div className="bg-base-200 w-full h-full flex flex-col">
      <Header />
      <div className="w-full h-full items-center justify-center flex flex-col">
        <form
          className="flex flex-col w-full items-center justify-center gap-6"
          action={async (formData) => {
            "use server";
            const resp = await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirect: false,
            });
            redirect("/home");
          }}
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
      </div>
    </div>
  );
};

export default Login;
