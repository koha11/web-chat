import {
  User,
  LogOut,
  Contact,
  ChevronDown,
  ChevronUp,
  MailPlus,
  FolderPlus,
  MessageCirclePlus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { IUser } from "@/interfaces/user.interface";
import { strimText } from "@/utils/text.helper";
import { useGetReceivedConnectRequests } from "@/hooks/user.hook";
import { useApolloClient } from "@apollo/client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ChatList = ({
  chatList,
  userId,
  lastMsgMap,
  currChatId,
  isChatsLoading,
  isLastMsgLoading,
  isNewChat,
  choosenUsers,
  chatSearch,
  setChatSearch,
}: {
  chatList: IChat[] | undefined;
  userId: string;
  lastMsgMap: {
    [chatId: string]: IMessage;
  };
  currChatId: string;
  isChatsLoading: boolean;
  isLastMsgLoading: boolean;
  isNewChat: boolean;
  choosenUsers: IUser[];
  setChatSearch: (value: string) => void;
  chatSearch: string;
}) => {
  const [isOpen, setOpen] = useState(false);

  const [draft, setDraft] = useState(chatSearch);

  // keep draft in sync if the external value changes
  useEffect(() => setDraft(chatSearch), [chatSearch]);

  // push to parent state after user pauses typing
  useEffect(() => {
    const t = setTimeout(() => setChatSearch(draft), 300);
    return () => clearTimeout(t);
  }, [draft, setChatSearch]);

  const {
    data: receivedConnectRequests,
    loading: isReceivedConnectRequestsLoading,
  } = useGetReceivedConnectRequests({});

  return (
    <section
      className="flex-2 h-full p-2 bg-white rounded-2xl space-y-2"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      {/* HEADER  */}
      <div className="flex justify-between items-center py-2 px-2">
        <h1 className="text-xl font-bold">My Chat</h1>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger className="p-2 rounded-full bg-gray-200 hover:opacity-50">
              <Link to="/m/new">
                <MessageCirclePlus></MessageCirclePlus>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new chat</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger className="p-2 rounded-full bg-gray-200 hover:opacity-50">
              <Link to="/me">
                <User></User>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Account</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger className="p-2 rounded-full bg-gray-200 hover:opacity-50 relative">
              <Link to="/contact" className="">
                <Contact></Contact>
              </Link>
              {receivedConnectRequests?.edges.length != 0 &&
                !isReceivedConnectRequestsLoading && (
                  <div className="absolute h-5 w-5 bg-red-700 rounded-full flex justify-center items-center font-bold text-[0.6rem] text-white -right-2 -top-2">
                    {receivedConnectRequests?.edges.length}
                  </div>
                )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Contacts</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Collapsible className="py-2" open={isOpen} onOpenChange={setOpen}>
        <CollapsibleTrigger className=" flex items-center justify-between w-full rounded-md cursor-pointer font-bold">
          <div className="flex items-center flex-5">
            <form action="" className="relative w-full">
              <Input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="rounded-3xl bg-gray-200 px-8 py-2 w-full text-gray-500"
                placeholder="Search Conversations"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              ></Input>
            </form>
          </div>
          {/* <div className="flex-1 flex justify-center items-center py-2">
            {isOpen ? <ChevronUp></ChevronUp> : <ChevronDown></ChevronDown>}
          </div> */}
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
        {/* create new chat display */}
        {isNewChat && (
          <div className="chat-box w-full h-18 relative">
            <div
              className={`flex items-center gap-4 px-2 py-4 rounded-2xl bg-gray-400 cursor-default relative`}
            >
              <div
                className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    choosenUsers.length == 0
                      ? "/assets/images/default-user.png"
                      : choosenUsers[0].avatar
                  })`,
                }}
              ></div>

              <div className="font-bold">
                {strimText(
                  `New message
                ${
                  choosenUsers.length > 0
                    ? `to ${choosenUsers.map((user) => user.fullname)}`
                    : ``
                }`,
                  45
                )}
              </div>

              {!isChatsLoading && (
                <Link
                  to={`/m/${chatList![0].id}`}
                  className="rounded-full absolute right-4 top-[50%] translate-y-[-50%] cursor-pointer opacity-30 bg-gray-200 p-1 hover:opacity-40"
                >
                  <X size={16}></X>
                </Link>
              )}
            </div>
          </div>
        )}
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
