import React from "react";

const User = ({ session }: { session: any }) => {
  return (
    <div className="avatar">
      <div className="w-10 rounded-full">
        {session?.user?.image && <img src={session?.user?.image} alt="" />}
      </div>
    </div>
  );
};

export default User;
