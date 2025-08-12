import { ReactElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IUser } from "@/interfaces/user.interface";
import { Link } from "react-router-dom";

const MemberDropdown = ({ user }: { user: IUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-4 cursor-pointer items-center justify-baseline w-full">
        <div
          className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
        <div className="flex flex-col items-baseline">
          <div>{user.fullname}</div>
          <div className="font-light">nguoi tao nhom</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="p-2 space-y-1">
        <DropdownMenuItem className="cursor-pointer font-bold">
          <Link to={`/m`}>Chat with {user.fullname.split(" ")[0]}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer font-bold">
          Remove from group
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer font-bold">
          bổ nhiệm làm nhóm trưởng
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberDropdown;
