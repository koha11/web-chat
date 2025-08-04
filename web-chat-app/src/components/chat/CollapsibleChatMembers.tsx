import MyCollapsible from "../ui/my-collapsible";
import { IChat } from "@/interfaces/chat.interface";
import { IUser } from "@/interfaces/user.interface";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";

const CollapsibleChatMembers = ({ chat }: { chat: IChat }) => {
  const navigate = useNavigate();

  const members = (chat.users as IUser[]).map((user) => {
    return {
      content: (
        <>
          <div
            className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${user.avatar})` }}
          ></div>
          <span>{user.fullname}</span>
        </>
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
      className="space-y-2"
    ></MyCollapsible>
  );
};

export default CollapsibleChatMembers;
