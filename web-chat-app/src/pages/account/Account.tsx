import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowLeftCircle, Settings, ShieldAlert, UserIcon } from "lucide-react";

const Account = () => {
  return (
    <div className="flex justify-center text-black h-screen">
      <div className="container flex bg-white gap-4 py-4">
        <section
          className="w-[25%] h-full p-2 bg-white rounded-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
        >
          <div className="flex justify-baseline items-center gap-4 h-[10%] px-2">
            <div className="text-xl">
              <Link to={"/m"}>
                <ArrowLeftCircle></ArrowLeftCircle>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Tài khoản</h1>
          </div>

          <nav className="h-[90%] overflow-y-scroll flex flex-col gap-2 mt-4 px-2">
            <NavLink
              to={"/me"}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl py-2 px-4  ${
                  isActive ? "cursor-default bg-gray-300" : "hover:bg-gray-300"
                }`
              }
              end
            >
              <div className="flex gap-4 items-center">
                <UserIcon></UserIcon>
                <div className="font-bold">General Information</div>
              </div>
            </NavLink>
            <NavLink
              to={"/me/security"}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl py-2 px-4  ${
                  isActive ? "cursor-default bg-gray-300" : "hover:bg-gray-300"
                }`
              }
            >
              <div className="flex gap-4 items-center">
                <ShieldAlert></ShieldAlert>
                <div className="font-bold">Security</div>
              </div>
            </NavLink>
            <NavLink
              to={"/me/settings"}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl py-2 px-4  ${
                  isActive ? "cursor-default bg-gray-300" : "hover:bg-gray-300"
                }`
              }
            >
              <div className="flex gap-4 items-center">
                <Settings></Settings>
                <div className="font-bold">Settings</div>
              </div>
            </NavLink>
          </nav>
        </section>
        <section
          className="w-[75%] h-full p-4 bg-white rounded-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
        >
          <Outlet></Outlet>
        </section>
      </div>
    </div>
  );
};

export default Account;
