import { FormEvent, useEffect, useRef, useState } from "react";
import { getData, postData } from "../../services/api";
import { Link, useParams } from "react-router-dom";
import SingleMsg from "../../components/SingleMsg";
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
import { MyTooltip } from "../../components/ui/myTooltip";
import { displaySendMsgTime } from "../../utils/messageTime.helper";

const ChatDetails = ({
  chat,
  userId,
  setChat,
  handleSendMessage,
  messages,
}: {
  messages: IMessage[];
  userId: string;
  chat: IChat;
  setChat: (chat: IChat) => void;
  handleSendMessage: (msg: IMessage, chatId: string) => void;
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
  // useEffect(() => {
  //   handleScrollToBot();
  // }, [isScrollBottom]);

  useEffect(() => {
    if (typeof chat.users == "object") {
      setReceivers(chat.users.filter((user) => user._id != userId));
      setSender(chat.users.find((user) => user._id == userId));
    }
  }, [chat]);

  // HANDLERs

  // const handleScrollToBot = () => {
  //   const msgListRef =
  //     msgsContainerRef.current?.querySelectorAll(".single-msg");

  //   msgListRef?.item(msgListRef.length - 1)?.scrollIntoView();
  // };

  // const handleOnTyping = (e: FormEvent<HTMLInputElement>) => {
  //   setMsgBody(e.currentTarget.value);
  //   socketRef.current?.emit("isTyping", chat._id);
  // };

  if (sender == null || receivers.length == 0) return <Loading></Loading>;

  return (
    <section
      className="w-[75%] h-full p-4 bg-white rounded-2xl"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="container flex items-center justify-between h-[10%]">
        <div className="flex items-center">
          <div
            className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${chat.chatAvatar})` }}
          ></div>
          <div className="ml-4">
            <h1 className="font-bold">{chat.chatName}</h1>
            <div className="text-gray-500 text-[0.75rem]">
              {receivers.some((receiver) => receiver.isOnline)
                ? "Đang hoạt động"
                : "Không hoạt động"}
            </div>
          </div>
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

      <div className="container h-[85%] overflow-y-scroll flex flex-col text-[0.9rem] py-4">
        {messages?.map((msg) => {
          // Dưới 20 phút thì ko cần hiện thời gian
          // const hasTimeSpan =
          //   lastMsgTime.current == null
          //     ? true
          //     : (timeSpan.getTime() - lastMsgTime.current?.getTime()) /
          //         (1000 * 60) >
          //       20;

          // const isLongGap =
          //   lastMsgTime.current == null
          //     ? true
          //     : (timeSpan.getTime() - lastMsgTime.current?.getTime()) / 1000 >
          //       60;

          // lastMsgTime.current = timeSpan;

          return (
            <>
              {/* {hasTimeSpan && (
                <div
                  key={"T" + msg.id}
                  className="msg-time text-center text-gray-400 text-[0.75rem]"
                >
                  {timeString}
                </div>
              )} */}
              <SingleMsg
                key={msg._id}
                isSentMsg={msg.user == userId}
                isLongGap={true}
                body={msg.msgBody}
                avatar={
                  (msg.user == userId ? receivers[0].avatar : sender?.avatar) ??
                  ""
                }
                sendTime={displaySendMsgTime(new Date(msg.createdAt ?? ""))}
              ></SingleMsg>
            </>
          );
        })}
      </div>

      <div className="container h-[5%]">
        <form
          className="relative w-full flex items-center justify-between"
          onSubmit={handleSubmit((msg: IMessage) => {
            handleSendMessage(msg, chat._id);
            resetField("msgBody");
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
