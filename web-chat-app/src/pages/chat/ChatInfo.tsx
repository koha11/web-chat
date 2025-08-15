import { BellOffIcon, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { getDisplayTimeDiff } from "../../utils/messageTime.helper";
import CollapsibleChatInfo from "../../components/chat/CollapsibleChatInfo";
import CollapsibleChatConfig from "../../components/chat/CollapsibleChatConfig";
import CollapsibleChatMembers from "../../components/chat/CollapsibleChatMembers";
import CollapsibleChatMedia from "../../components/chat/CollapsibleChatMedia";
import CollapsibleChatPrivacy from "../../components/chat/CollapsibleChatPrivacy";
import ChatFileDiaglog from "@/components/chat/ChatFileDiaglog";

const ChatInfo = ({
  chat,
  userId,
  open,
  setMediaId,
}: {
  chat: IChat;
  userId: string;
  open: boolean;
  setMediaId: (msgId: string) => void;
}) => {
  if (!chat) return <></>;

  const receivers = (chat.users as IUser[]).filter((user) => user.id != userId);
  const isGroupChat = true;

  return (
    <section
      className="flex-2 h-full p-2 bg-white rounded-2xl flex flex-col items-center gap-2 overflow-y-scroll"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
      hidden={!open}
    >
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${chat.chatAvatar})` }}
        ></div>
        {receivers.some((user) => user.isOnline) && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <h1 className="font-bold">{chat.chatName}</h1>
      <div className="text-gray-500 text-[0.75rem]">
        {receivers &&
        Object.values(receivers).some((receiver) => receiver.isOnline)
          ? "Online"
          : `Online ${getDisplayTimeDiff(
              Object.values(receivers).sort(
                (a, b) =>
                  new Date(b.lastLogined ?? "").getTime() -
                  new Date(a.lastLogined ?? "").getTime()
              )[0].lastLogined!
            )} ago`}
      </div>

      <div className="flex items-center justify-center w-full gap-6 mt-2">
        <Button className="rounded-full cursor-pointer" variant={"outline"}>
          <BellOffIcon></BellOffIcon>
        </Button>
        <Button className="rounded-full cursor-pointer" variant={"outline"}>
          <Search></Search>
        </Button>
      </div>

      <CollapsibleChatInfo></CollapsibleChatInfo>
      <CollapsibleChatConfig chat={chat}></CollapsibleChatConfig>
      {isGroupChat && (
        <CollapsibleChatMembers chat={chat}></CollapsibleChatMembers>
      )}
      <CollapsibleChatMedia setMediaId={setMediaId}></CollapsibleChatMedia>
      <CollapsibleChatPrivacy chatId={chat.id}></CollapsibleChatPrivacy>
    </section>
  );
};

export default ChatInfo;
