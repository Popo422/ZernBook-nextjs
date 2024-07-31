"use client";
import { signOut, useSession } from "next-auth/react";
import { BiArrowBack, BiBell, BiMenu, BiUser } from "react-icons/bi";
import User from "./User";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkFriendRequests } from "../utils/friends/utils";

const Header = ({ page }: { page: string }) => {
  const session = useSession();
  const { data: sessionData } = session;
  const router = useRouter();
  const [friendRequest, setFriendRequest] = useState<any>([]);
  const [userId, setUserId] = useState<string>("");

  const fetchFriendRequests = async (userId: string) => {
    try {
      const result = await checkFriendRequests(userId);
      console.log(result);
      setFriendRequest(result);
    } catch (err) {
      console.log(err);
    }
  };
  const acceptUser = async (friendId: string, userId: string) => {
    try {
      const res = await fetch("/api/user/acceptUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          friendId,
        }),
        cache: "no-store",
      });
      const data = await res.json();
      fetchFriendRequests(userId);
    } catch (err) {
      console.log(err);
    }
  };
  const rejectUser = async (friendId: string) => {
    try {
      const res = await fetch("/api/user/rejectUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          friendId,
        }),
        cache: "no-store",
      });
      const data = await res.json();
      fetchFriendRequests(userId);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      const userId = session.data?.user?.id || "";
      setUserId(userId);
      fetchFriendRequests(userId);
    }
  }, [session]);

  return (
    <div className="w-full bg-base-100 flex justify-between p-4 items-center">
      {sessionData ? (
        page !== "home" ? (
          <button className="btn " onClick={() => router.push("/home")}>
            {" "}
            <BiArrowBack />
          </button>
        ) : (
          <button
            className="hover:bg-base-300"
            onClick={() => router.push(`/${sessionData?.user?.id}`)}
          >
            <User session={sessionData} />
          </button>
        )
      ) : (
        <button
          type="submit"
          className=" btn btn-neutral"
          onClick={() => {
            redirect("/login");
          }}
        >
          Sign In
        </button>
      )}
      <h1 className="text-3xl">
        <span className="font-bold text-primary ">Zern</span>Book
      </h1>
      {session.status === "authenticated" ? (
        <div className="flex gap-10">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 relative"
              onClick={() => fetchFriendRequests(userId)}
            >
              <BiBell size={22} />
              {friendRequest && friendRequest.length > 0 && (
                <div className="badge badge-primary absolute right-0 top-0">
                  {friendRequest.length}
                </div>
              )}
            </div>
            {friendRequest && friendRequest.length > 0 && (
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
              >
                {friendRequest.map((friendRequest: any) => {
                  const { friends, user } = friendRequest;
                  return (
                    <li key={friends.userId} className="flex flex-col gap-1">
                      <div className="flex px-3">
                        <img
                          src={user.image}
                          height={32}
                          width={32}
                          className="rounded-full"
                        />
                        <span className="text-xs">
                          {user.name} sent you a friend request
                        </span>
                      </div>
                      <div className="w-full flex justify-end">
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => {
                            acceptUser(friends.userId, userId);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => {
                            rejectUser(friends.userId);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
              <BiMenu size={22} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <button
                  type="submit"
                  className="w-full btn btn-neutral"
                  onClick={async () => {
                    signOut({ callbackUrl: "/login" });
                  }}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-[5%]"></div>
      )}
    </div>
  );
};

export default Header;
