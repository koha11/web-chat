import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMessage } from "../../interfaces/message.interface";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { MoreHorizontal, Phone, Video, X } from "lucide-react";
import { useForm } from "react-hook-form";
import MessageStatus from "../../enums/MessageStatus.enum";
import { getTimeDiff, TimeTypeOption } from "../../utils/messageTime.helper";
import { GroupMsg } from "../../components/message/MsgGroup";
import IMessageGroup from "../../interfaces/messageGroup.interface";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
} from "../../components/ui/collapsible";
import { Button } from "../../components/ui/button";
import {
  useUnsendMessage,
  useGetMessages,
  usePostMessage,
} from "../../hooks/message.hook";
import { MESSAGE_ADDED_SUB } from "../../services/messageService";
import { PageInfo } from "../../interfaces/modelConnection.interface";

const ChatDetails = ({
  chat,
  userId,
  chatId,
}: {
  userId: string;
  chat: IChat | undefined;
  chatId: string;
}) => {
  // states
  const [receivers, setReceivers] = useState<{ [userId: string]: IUser }>({});
  const [sender, setSender] = useState<IUser>();
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [messages, setMessages] = useState<IMessageGroup[]>();
  const [isOpen, setOpen] = useState(false);

  const {
    data: messagesConnection,
    loading: isMsgLoading,
    subscribeToMore,
    refetch,
  } = useGetMessages({
    chatId: chatId,
    first: 30,
  });

  const [postMessage] = usePostMessage();

  // useForm
  const { register, handleSubmit, resetField, setValue, watch } =
    useForm<IMessage>({
      defaultValues: {
        user: userId,
        msgBody: "",
        status: MessageStatus.SENT,
        seenList: {},
        replyForMsg: undefined,
      },
    });

  // useEffect

  useEffect(() => {
    if (messagesConnection) {
      setPageInfo(messagesConnection.pageInfo);

      const grouped = messagesConnection.edges.reduce<IMessageGroup[]>(
        (acc, edge) => {
          const msg = edge.node;
          const time = new Date(msg.createdAt!);
          const last = acc[acc.length - 1];

          if (
            last &&
            getTimeDiff(
              new Date(last.timeString),
              time,
              TimeTypeOption.MINUTES
            ) < 20
          ) {
            last.messages.push(msg);
          } else {
            acc.push({ timeString: time.toISOString(), messages: [msg] });
          }

          return acc;
        },
        []
      );

      setMessages(grouped);

      const unsubscribe = subscribeToMore({
        document: MESSAGE_ADDED_SUB,
        variables: { chatId: chat?.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const newMsg = subscriptionData.data.messageAdded;

          return Object.assign({}, prev, {
            ...prev,
            messages: {
              ...prev.messages,
              pageInfo: {
                ...prev.messages.pageInfo,
                startCursor: newMsg.cursor,
              },
              edges: [newMsg, ...prev.messages.edges],
            },
          });
        },
      });

      return () => {
        unsubscribe();
      };
    }
  }, [messagesConnection, subscribeToMore]);

  useEffect(() => {
    if (chat && typeof chat.users == "object") {
      let myMap = {} as { [userId: string]: IUser };
      chat.users.forEach((user) => {
        if (user.id != userId) myMap[user.id] = user;
      });

      setReceivers(myMap);
      setSender(chat.users.find((user) => user.id == userId));
    }
  }, [chat]);

  useEffect(() => {
    console.log("refetch messages");
    refetch();
  }, [chatId]);

  // HANDLERs
  const handleReplyMsg = (msg: IMessage) => {
    setValue("replyForMsg", msg);
    setOpen(true);
  };

  const handleSendMessage = (msg: IMessage, chatId: string) => {
    postMessage({
      variables: {
        msgBody: msg.msgBody,
        user: msg.user,
        chatId,
        replyForMsg: msg.replyForMsg
          ? (msg.replyForMsg as IMessage).id
          : undefined,
      },
    });
  };

  return (
    <section
      className="w-[75%] h-full p-4 bg-white rounded-2xl"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="container flex items-center justify-between h-[10%]">
        <div className="flex items-center">
          {chat && !isMsgLoading ? (
            <div
              className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${chat.chatAvatar})` }}
            ></div>
          ) : (
            <Skeleton className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"></Skeleton>
          )}

          {chat && !isMsgLoading ? (
            <div className="ml-4">
              <h1 className="font-bold">{chat.chatName}</h1>
              <div className="text-gray-500 text-[0.75rem]">
                {Object.values(receivers).some((receiver) => receiver.isOnline)
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

      <div className="container h-[85%] overflow-y-scroll flex flex-col-reverse text-[0.9rem] py-4">
        {watch("replyForMsg") != undefined && (
          <Collapsible open={isOpen} onOpenChange={setOpen}>
            <CollapsibleContent className="flex flex-auto items-center justify-between border-t-2">
              <div className="py-1 space-y-2">
                <div className="font-semibold">
                  Replying to{" "}
                  {receivers[(watch("replyForMsg") as IMessage).user.toString()]
                    ?.fullname ?? "yourself"}
                </div>
                <div className="text-[0.7rem]">
                  {(watch("replyForMsg") as IMessage).msgBody}
                </div>
              </div>
              <Button
                variant={"outline"}
                className="h-6 w-4 rounded-full cursor-pointer border-0"
                onClick={() => {
                  setOpen(false);
                  resetField("replyForMsg");
                }}
              >
                <X></X>
              </Button>
            </CollapsibleContent>
          </Collapsible>
        )}

        {chat && sender && messages
          ? messages.map((msg, index) => {
              return (
                <GroupMsg
                  key={msg.timeString}
                  messages={msg.messages}
                  timeString={msg.timeString}
                  receivers={receivers}
                  sender={sender}
                  isFirstGroup={index == 0}
                  handleReplyMsg={handleReplyMsg}                  
                ></GroupMsg>
              );
            })
          : [1, 2, 3, 4, 5].map(() => (
              <div className="space-y-2 flex flex-col items-end my-2">
                <Skeleton className="h-4 w-[240px] bg-black"></Skeleton>
                <Skeleton className="h-4 w-[80px] bg-black"></Skeleton>
              </div>
            ))}
      </div>
      <div className="container h-[5%]">
        <form
          className="relative w-full flex items-center justify-between"
          autoComplete="off"
          onSubmit={handleSubmit((msg: IMessage) => {
            if (chat != undefined) {
              handleSendMessage(msg, chat.id);
              resetField("msgBody");
              resetField("replyForMsg");
              setOpen(false);
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
