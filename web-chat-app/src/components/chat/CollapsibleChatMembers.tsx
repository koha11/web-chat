import MyCollapsible from "../ui/my-collapsible";
import { IChat } from "@/interfaces/chat.interface";
import { IUser } from "@/interfaces/user.interface";
import { UserPlus } from "lucide-react";
import MemberDropdown from "./MemberDropdown";
import Cookies from "js-cookie";
import { ReactNode, useState } from "react";
import AddMembersDialog from "./AddMembersDialog";

const CollapsibleChatMembers = ({ chat }: { chat: IChat }) => {
  const userId = Cookies.get("userId")!;

  const [isOpen, setOpen] = useState(false);

  const members = (chat.users as IUser[]).map((user) => {
    return {
      content: (
        <MemberDropdown
          chatId={chat.id}
          user={user}
          key={user.id}
          role={chat.usersInfo[user.id].role!.toLowerCase() as any}
          userRole={chat.usersInfo[userId].role!.toLowerCase() as any}
          userId={userId}
        ></MemberDropdown>
      ),
      onClick: () => {},
    };
  }) as {
    content: ReactNode;
    onClick: Function;
    dialog?: ReactNode;
    hidden?: boolean;
  }[];

  members.push({
    content: (
      <>
        <UserPlus></UserPlus>
        <span>Add member</span>
      </>
    ),
    onClick: () => {
      setOpen(true);
    },
    dialog: (
      <AddMembersDialog
        isOpen={isOpen}
        setOpen={setOpen}
        chatId={chat.id}
      ></AddMembersDialog>
    ),
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
