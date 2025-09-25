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
import { useRemoveMember } from "@/hooks/chat.hook";

const MemberDropdown = ({
  userId,
  userRole,
  user,
  role,
  chatId,
  privateChatId,
}: {
  userId: string;
  userRole: "member" | "creator" | "leader";
  user: IUser;
  role: "member" | "creator" | "leader";
  chatId: string;
  privateChatId?: string;
}) => {
  const [removeMember, { loading: isRemoving }] = useRemoveMember({ userId });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex gap-4 items-center justify-baseline w-full ${
          userId == user.id ? "" : "cursor-pointer"
        }`}
        disabled={userId == user.id}
      >
        <div
          className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${user.avatar})` }}
        ></div>
        <div className="flex flex-col items-baseline">
          <div>{user.fullname}</div>
          <div className="font-light capitalize">{role}</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="p-2 space-y-1">
        <DropdownMenuItem className="cursor-pointer font-bold">
          <Link to={`/m/${privateChatId}`}>
            Chat with {user.fullname.split(" ")[0]}
          </Link>
        </DropdownMenuItem>
        {userRole != "member" && (
          <>
            {/* <DropdownMenuItem className="cursor-pointer font-bold">
              bổ nhiệm làm nhóm trưởng
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className="cursor-pointer font-bold"
              onClick={async () => {
                if (!isRemoving)
                  await removeMember({
                    variables: {
                      chatId,
                      removedUserId: user.id,
                    },
                  });
              }}
            >
              Remove from group
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberDropdown;
