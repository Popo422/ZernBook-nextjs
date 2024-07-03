import { signOut } from "@/auth";
import { BiMenu, BiUser } from "react-icons/bi";

const Header = () => {
  return (
    <div className="w-full bg-base-100 flex justify-between p-4 items-center">
      <BiUser size={22} />
      <span>ZernBook</span>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1">
          <BiMenu size={22} />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <form
              className="w-full flex"
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button type="submit" className="w-full btn btn-neutral">
                Sign Out
              </button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
