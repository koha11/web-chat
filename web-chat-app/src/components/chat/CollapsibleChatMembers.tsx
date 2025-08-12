import MyCollapsible from "../ui/my-collapsible";
import { IChat } from "@/interfaces/chat.interface";
import { IUser } from "@/interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import MemberDropdown from "./MemberDropdown";

const CollapsibleChatMembers = ({ chat }: { chat: IChat }) => {
  const navigate = useNavigate();

  const members = (chat.users as IUser[]).map((user) => {
    return {
      content: (
        <MemberDropdown
          user={user}
          key={user.id}
          role={chat.usersInfo[user.id].role!.toLowerCase()}
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
