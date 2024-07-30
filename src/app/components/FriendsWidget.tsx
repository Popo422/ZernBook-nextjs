"use client";

import { useState } from "react";

const FriendsWidget = ({ userFriends }: { userFriends: any }) => {
  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Friends</h2>

        {userFriends && userFriends.length > 0 ? (
          <ul className=" bg-base-100 w-full p-2 rounded-box grid grid-cols-2 gap-5">
            {userFriends.map((friend: any) => {
              const { user } = friend;
              return (
                <li key={user.id} className="w-full">
                  <div className="w-fit  justify-between items-center gap-5 flex ">
                    <img src={user.image} height={32} width={32} className="" />
                    <span className="text-xs">{user.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <span className="w-full text-center">No friends</span>
        )}
      </div>
    </div>
  );
};

export default FriendsWidget;
