import { FormEvent, useEffect, useRef, useState } from "react";
import { getData, postData } from "../../services/api";
import { Link, useParams } from "react-router-dom";
import SingleMsg from "../../components/message/SingleMsg";
import WebSocketConnection from "../../services/WebSocketConnection";
import { Socket } from "socket.io-client";
import { IMessage } from "../../interfaces/message.interface";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { isArray } from "../../utils/checkType.helper";
import { MoreHorizontal, Phone, Video } from "lucide-react";
import { useForm } from "react-hook-form";
import MessageStatus from "../../enums/MessageStatus.enum";
import Loading from "../../components/ui/loading";
import { MyTooltip } from "../../components/ui/my-tooltip";
import { getDisplaySendMsgTime } from "../../utils/messageTime.helper";
import { GroupMsg } from "../../components/message/MsgGroup";
import IMessageGroup from "../../interfaces/messageGroup.interface";
import { send } from "process";
import { Skeleton } from "../../components/ui/skeleton";

const ChatDetails = ({
  chat,
  userId,
  handleSendMessage,
  messages,
  msgsContainerRef,
  isMsgLoading,
}: {
  messages: IMessageGroup[];
  userId: string;
  chat: IChat | undefined;
  handleSendMessage: (msg: IMessage, chatId: string) => void;
  msgsContainerRef: any;
  isMsgLoading: boolean;
}) => {
  // states
  const [receivers, setReceivers] = useState<IUser[]>([]);
  const [sender, setSender] = useState<IUser>();

  // useForm
  const { register, handleSubmit, resetField } = useForm<IMessage>({
    defaultValues: {
      user: userId,
      msgBody: "",
      status: MessageStatus.SENT,
    },
  });

  // useEffect

  useEffect(() => {
    if (chat && typeof chat.users == "object") {
      setReceivers(chat.users.filter((user) => user._id != userId));
      setSender(chat.users.find((user) => user._id == userId));
    }
  }, [chat]);

  // HANDLERs

  return (
    <section
      className="w-[75%] h-full p-4 bg-white rounded-2xl"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="container flex items-center justify-between h-[10%]">
        <div className="flex items-center">
          {chat ? (
            <div
              className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${chat.chatAvatar})` }}
            ></div>
          ) : (
            <Skeleton className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"></Skeleton>
          )}

          {chat ? (
            <div className="ml-4">
              <h1 className="font-bold">{chat.chatName}</h1>
              <div className="text-gray-500 text-[0.75rem]">
                {receivers.some((receiver) => receiver.isOnline)
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
              </div>
            </div>
          ) : (
            <div className="ml-4 space-y-2">
              <Skeleton className="h-4 w-[240px]"></Skeleton>
              <Skeleton className="h-4 w-[120px]"></Skeleton>
            </div>
          )}
        </div>
        <div className="text-2xl flex items-center gap-4">
          <Link to={""} className="p-2 rounded-full hover:bg-gray-200">
            <Phone></Phone>
          </Link>
          <Link to={""} className="p-2 rounded-full hover:bg-gray-200">
            <Video></Video>
          </Link>
          <Link to={""} className="p-2 rounded-full hover:bg-gray-200">
            <MoreHorizontal></MoreHorizontal>
          </Link>
        </div>
      </div>

      <div
        className="container h-[85%] overflow-y-scroll flex flex-col-reverse text-[0.9rem] py-4"
        ref={msgsContainerRef}
      >
        {chat && sender && !isMsgLoading ? (
          messages?.map((msg, index) => {
            return (
              <GroupMsg
                key={msg.timeString}
                messages={msg.messages}
                timeString={msg.timeString}
                receivers={receivers}
                sender={sender}
                isFirstGroup={index == 0}
              ></GroupMsg>
            );
          })
        ) : (
          // : [1, 2, 3, 4, 5].map(() => (
          //     <div className="space-y-2 flex flex-col items-end">
          //       <Skeleton className="h-4 w-[240px]"></Skeleton>
          //       <Skeleton className="h-4 w-[80px]"></Skeleton>
          //     </div>
          //   ))
          <Loading />
        )}
      </div>

      <div className="container h-[5%]">
        <form
          className="relative w-full flex items-center justify-between"
          onSubmit={handleSubmit((msg: IMessage) => {
            if (chat != undefined) {
              handleSendMessage(msg, chat._id);
              resetField("msgBody");
            }
          })}
        >
          <label
            htmlFor="uploaded-image"
            className="rounded-full mr-2 cursor-pointer"
          >
            <i className="bx bx-image text-2xl p-2 rounded-full hover:bg-gray-200"></i>
          </label>

          {/* <input id="uploaded-image" type="file" className="hidden"></input>   */}

          <input
            {...register("msgBody", { required: true })}
            className="rounded-3xl flex-auto bg-gray-200 px-4 py-2 text-gray-500"
            placeholder="Aa"
          ></input>

          <button className="rounded-full ml-2 cursor-pointer" type="submit">
            <i className="bx bx-send text-2xl p-2 rounded-full hover:bg-gray-200"></i>
          </button>
          <button className="rounded-full ml-2 cursor-pointer">
            <i className="bx bxs-hand text-2xl p-2 rounded-full hover:bg-gray-200"></i>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatDetails;
