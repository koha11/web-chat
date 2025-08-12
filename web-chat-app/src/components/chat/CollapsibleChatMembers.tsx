import MyCollapsible from "../ui/my-collapsible";
import { IChat } from "@/interfaces/chat.interface";
import { IUser } from "@/interfaces/user.interface";
import { UserPlus } from "lucide-react";
import MemberDropdown from "./MemberDropdown";
import Cookies from "js-cookie";

const CollapsibleChatMembers = ({ chat }: { chat: IChat }) => {
  const userId = Cookies.get("userId")!;

  const members = (chat.users as IUser[]).map((user) => {
    return {
      content: (
        <MemberDropdown
          user={user}
          key={user.id}
          role={chat.usersInfo[user.id].role!.toLowerCase() as any}
          userRole={chat.usersInfo[userId].role!.toLowerCase() as any}
          userId={userId}
        ></MemberDropdown>
      ),
      onClick: () => {},
    };
  });

  members.push({
    content: (
      <>
        <UserPlus></UserPlus>
        <span>Add member</span>
      </>
    ),
    onClick: () => {},
  });

  return (
    <MyCollapsible
      data={members}
      title="Chat Members"
      className="space-y-2 mt-2"
    ></MyCollapsible>
  );
};

export default CollapsibleChatMembers;
