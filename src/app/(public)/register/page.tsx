"use client";
import { FormEvent, useState } from "react";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          firstName: formData.get("firstName"), // Include firstName
          lastName: formData.get("lastName"), // Include lastName
        }),
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-base-200">
      <h1 className="text-center text-xl font-bold">Logo</h1>
      {loading && <span className="loading loading-spinner loading-lg z-10" />}
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="mt-4 flex justify-between">
          <label htmlFor="email" className="py-2 pr-4">
            Email Address
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="rounded-md p-2"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <label htmlFor="password" className="py-2 pr-4">
            Password
          </label>
          <input
            type="password" // Change type to password for security
            id="password"
            name="password"
            className="rounded-md p-2"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <label htmlFor="firstName" className="py-2 pr-4">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="rounded-md p-2"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <label htmlFor="lastName" className="py-2 pr-4">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="mt-10 self-center rounded-md bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};
export default Register;
