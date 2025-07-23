import { User, LogOut, Contact, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import Cookies from "js-cookie";
import { useState } from "react";
import ChatRow from "../../components/chat/ChatRow";
import { Skeleton } from "../../components/ui/skeleton";
import { IMessage } from "../../interfaces/messages/message.interface";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import EmblaCarousel from "@/components/carousel/EmblaCarousel";

const ChatList = ({
  chatList,
  userId,
  lastMsgMap,
  currChatId,
  isChatsLoading,
  isLastMsgLoading,
}: {
  chatList: IChat[] | undefined;
  userId: string;
  lastMsgMap: {
    [chatId: string]: IMessage;
  };
  currChatId: string;
  isChatsLoading: boolean;
  isLastMsgLoading: boolean;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setOpen] = useState(false);

  return (
    <section
      className="flex-2 h-full p-2 bg-white rounded-2xl space-y-2"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="flex justify-between items-center py-2 px-2">
        <h1 className="text-xl font-bold">Đoạn chat</h1>
        <div className="flex items-center gap-2">
          <Link
            to="/me"
            className="p-2 rounded-full bg-gray-200 hover:opacity-50"
          >
            <User></User>
          </Link>
          <Link
            to={"/login"}
            onClick={() => {
              const token = Cookies.get("accessToken");

              if (token) {
                Cookies.remove("accessToken");
                Cookies.remove("userId");
              }
            }}
            className="p-2 rounded-full bg-gray-200 hover:opacity-50"
          >
            <LogOut></LogOut>
          </Link>
          <Link
            to="/contact"
            className="p-2 rounded-full bg-gray-200 hover:opacity-50"
          >
            <Contact></Contact>
          </Link>
        </div>
      </div>

      <Collapsible className="py-2" open={isOpen} onOpenChange={setOpen}>
        <CollapsibleTrigger className=" flex items-center justify-between w-full rounded-md cursor-pointer font-bold">
          <div className="flex items-center flex-5">
            <form action="" className="relative w-full">
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="rounded-3xl bg-gray-200 px-8 py-2 w-full text-gray-500"
                placeholder="Tìm kiếm đoạn chat"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              ></Input>
            </form>
          </div>
          <div className="flex-1 flex justify-center items-center py-2">
            {isOpen ? <ChevronUp></ChevronUp> : <ChevronDown></ChevronDown>}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <EmblaCarousel
            slides={[
              { content: "Current Chat", onClick: () => {} },
              { content: "Chat from stranger", onClick: () => {} },
              { content: "Store Chat", onClick: () => {} },
              { content: "Restrict Chat", onClick: () => {} },
            ]}
            options={{ align: "start", dragFree: true }}
          />
        </CollapsibleContent>
      </Collapsible>

      <nav
        id="chat-box-list"
        className="overflow-y-scroll flex flex-col gap-6 h-[70%]"
      >
        {isChatsLoading
          ? [1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className={
                  "chat-box flex w-full items-center h-18 p-4 rounded-2xl"
                }
              >
                <Skeleton className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"></Skeleton>
                <div className="flex-auto px-4 flex flex-col items-baseline space-y-2">
                  <Skeleton className="h-4 w-[100px]"></Skeleton>
                  <Skeleton className="h-4 w-[160px]"></Skeleton>
                </div>
              </div>
            ))
          : chatList!.map((chat: IChat) => (
              <ChatRow
                chat={chat}
                userId={userId}
                key={chat.id}
                lastMsg={lastMsgMap && lastMsgMap[chat.id]}
                isLastMsgLoading={isLastMsgLoading}
                isActive={currChatId == chat.id}
              ></ChatRow>
            ))}
      </nav>
    </section>
  );
};

export default ChatList;
