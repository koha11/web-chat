import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dot, MessageCircleCode, MoreHorizontal, Pin } from "lucide-react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { getDisplayTimeDiff } from "../../utils/messageTime.helper";
import { Skeleton } from "../ui/skeleton";
import { strimText } from "../../utils/text.helper";
import { Button } from "../ui/button";
import MessageStatus from "../../enums/MessageStatus.enum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IMessage } from "../../interfaces/messages/message.interface";
import MessageType from "@/enums/MessageType.enum";
import LastMsgBody from "./LastMsgBody";

const ChatRow = ({
  userId,
  chat,
  lastMsg,
  isActive,
  isLastMsgLoading,
}: {
  userId: string;
  chat: IChat;
  lastMsg: IMessage | undefined;
  isActive: boolean;
  isLastMsgLoading: boolean;
}) => {
  const [users, setUsers] = useState<IUser[]>();
  const [isHover, setHover] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (chat != undefined && !isLastMsgLoading) {
      setUsers(chat.users as IUser[]);
    }
  }, [chat]);

  return (
    <NavLink to={`/m/${chat.id}`} className={`chat-box w-full h-18 relative`}>
      <div
        className={`flex items-center px-2 py-4 rounded-2xl ${
          isActive ? "bg-gray-400 cursor-default" : "hover:bg-gray-200"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => {
          if (isActive) {
            e.preventDefault();
            return;
          }
        }}
      >
        <div
          className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${chat.chatAvatar})` }}
        ></div>
        <div className="flex-auto px-2 flex flex-col items-baseline space-y-1">
          <div className="font-bold">{chat.chatName}</div>

          {/* noi dung tin nhan  */}
          <div className="text-gray-500 text-[0.75rem] flex items-center w-full  text-nowrap">
            {isLastMsgLoading ? (
              <Skeleton className="w-[200px] h-4"></Skeleton>
            ) : (
              lastMsg && (
                <>
                  <LastMsgBody
                    chat={chat}
                    lastMsg={lastMsg}
                    userId={userId}
                    key={chat.id}
                  ></LastMsgBody>
                  <div className="flex items-center">
                    {lastMsg && <Dot size={12}></Dot>}
                    {lastMsg &&
                      getDisplayTimeDiff(
                        lastMsg.status == MessageStatus.UNSEND
                          ? lastMsg.unsentAt!
                          : lastMsg.createdAt!
                      )}
                  </div>
                </>
              )
            )}
          </div>
        </div>

        {/* Hien thi avatar nhung nguoi da seen tin nhan  */}
        {!isLastMsgLoading &&
          lastMsg &&
          lastMsg.user == userId &&
          lastMsg.status == MessageStatus.SEEN &&
          users &&
          Object.keys(lastMsg.seenList).map((receiverId) => {
            const receiver = users.find(
              (receiver) => receiver.id == receiverId
            );

            if (receiver)
              return (
                <div
                  className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(${receiver.avatar})` }}
                  key={receiver.id}
                ></div>
              );
          })}

        {/* Hien thi thong bao chua doc tin nhan */}
        {lastMsg &&
          lastMsg.user != userId &&
          !Object.keys(lastMsg.seenList).includes(userId) && (
            <div className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center bg-blue-600"></div>
          )}
      </div>

      {/* {isHover && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              asChild
              variant={"secondary"}
              className="absolute rounded-full h-8 w-8 right-7 top-[50%] translate-y-[-50%] bg-gray-300 hover:bg-gray-500 shadow-xl cursor-pointer"
              onMouseEnter={() => setHover(true)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen(true);
              }}
            >
              <MoreHorizontal></MoreHorizontal>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 shadow-2xl px-2"
            align="start"
            side="top"
            sideOffset={80}
            collisionPadding={20}
          >
            <DropdownMenuItem className="cursor-pointer">
              <Pin></Pin> Pin
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <MessageCircleCode></MessageCircleCode> Mark as unread
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Mute nofication
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Phone Call
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Video Call
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Block
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Restore Chat
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Delete Chat
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )} */}
    </NavLink>
  );
};

export default ChatRow;
