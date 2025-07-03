import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { MoreHorizontal, Phone, Video, X } from "lucide-react";
import { useForm } from "react-hook-form";
import MessageStatus from "../../enums/MessageStatus.enum";
import {
  getDisplayTimeDiff,
  getTimeDiff,
  TimeTypeOption,
} from "../../utils/messageTime.helper";
import { GroupMsg } from "../../components/message/MsgGroup";
import IMessageGroup from "../../interfaces/messages/messageGroup.interface";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
} from "../../components/ui/collapsible";
import { Button } from "../../components/ui/button";
import {
  useGetMessages,
  usePostMessage,
  useTypeMessage,
} from "../../hooks/message.hook";
import {
  MESSAGE_ADDED_SUB,
  MESSAGE_CHANGED_SUB,
  MESSAGE_TYPING_SUB,
} from "../../services/messageService";
import { IMessage } from "../../interfaces/messages/message.interface";
import { useApolloClient, useSubscription } from "@apollo/client";
import IModelConnection, {
  Edge,
} from "../../interfaces/modelConnection.interface";
import { client } from "../../apollo";
import { TypingIndicator } from "../../components/ui/typing-indicator";

const ChatDetails = ({
  chat,
  userId,
  chatId,
  hasUpdated,
  setUpdatedChatMap,
  setChatInfoOpen,
}: {
  userId: string;
  chat: IChat | undefined;
  chatId: string;
  hasUpdated: boolean;
  setUpdatedChatMap: Function;
  setChatInfoOpen: Function;
}) => {
  // states
  const [receivers, setReceivers] = useState<{ [userId: string]: IUser }>({});
  const [sender, setSender] = useState<IUser>();
  const [messages, setMessages] = useState<IMessageGroup[]>();
  const [isOpen, setOpen] = useState(false);
  const [isFetchMore, setFetchMore] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<IUser[]>();

  const {
    data: messagesConnection,
    loading: isMsgLoading,
    refetch: refetchMessages,
    subscribeToMore,
    fetchMore,
  } = useGetMessages({
    chatId: chatId,
    first: 20,
    after: undefined,
  });

  const [postMessage] = usePostMessage({ first: 20 });

  const [typeMessage] = useTypeMessage();

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

  const msgsContainerRef = useRef<HTMLDivElement>(null);

  // useEffect

  useEffect(() => {
    if (messagesConnection) {
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
      setFetchMore(false);

      const unsubscribeMsgAdded = subscribeToMore({
        document: MESSAGE_CHANGED_SUB,
        variables: { chatId: chatId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const messageChanged = subscriptionData.data
            .messageChanged as Edge<IMessage>;
          const prevMessages = prev.messages as IModelConnection<IMessage>;

          return {
            ...prev,
            messages: {
              ...prevMessages,
              edges: prevMessages.edges.map((edge) => {
                if (edge.cursor == messageChanged.cursor) return messageChanged;

                return edge;
              }),
            },
          };
        },
      });

      const unsubscribeMsgChanged = subscribeToMore({
        document: MESSAGE_ADDED_SUB,
        variables: { chatId: chatId },
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

      const unsubscribeMsgTyping = subscribeToMore({
        document: MESSAGE_TYPING_SUB,
        variables: { chatId: chatId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const messageTyping = subscriptionData.data.messageTyping as {
            typingUser: IUser;
            isTyping: boolean;
          };

          setTypingUsers((old) => {
            if (messageTyping.isTyping)
              return [...(old ?? []), messageTyping.typingUser];

            return old?.filter((old) => old.id != messageTyping.typingUser.id);
          });

          return prev;
        },
      });

      return () => {
        unsubscribeMsgAdded();
        unsubscribeMsgChanged();
        unsubscribeMsgTyping();
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
    if (hasUpdated) {
      refetchMessages();
      setUpdatedChatMap((old: any) => {
        return { ...old, [chatId]: true };
      });
    }
  }, [chatId]);

  // HANDLERs
  const handleReplyMsg = (msg: IMessage) => {
    setValue("replyForMsg", msg);
    setOpen(true);
  };

  const handleSendMessage = ({
    chatId,
    msgBody,
    user,
    replyForMsg,
    isForwarded,
  }: {
    msgBody: string;
    user: string;
    chatId: string;
    replyForMsg?: string;
    isForwarded?: boolean;
  }) => {
    postMessage({
      variables: {
        chatId,
        msgBody,
        user,
        replyForMsg,
        isForwarded,
      },
    });
  };

  const handleLoadMoreMessages = () => {
    if (messagesConnection?.pageInfo.hasNextPage) {
      setFetchMore(true);

      fetchMore({
        variables: {
          after: messagesConnection?.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newData = fetchMoreResult.messages;
          const previousData = prev.messages;

          return {
            ...prev,
            messages: {
              ...newData,
              pageInfo: {
                ...newData.pageInfo,
                startCursor: previousData.pageInfo.startCursor,
              },
              edges: previousData.edges.concat(newData.edges),
            },
          };
        },
      });
    }
  };

  console.log(chat);
  console.log(sender);
  console.log(messages);

  return (
    <section
      className="flex-5 h-full p-4 bg-white rounded-2xl"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="container flex items-center justify-between h-[10%]">
        <div className="flex items-center">
          {chat && !isMsgLoading ? (
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${chat.chatAvatar})` }}
              ></div>
              {Object.values(receivers).some(
                (receiver) => receiver.isOnline
              ) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
          ) : (
            <Skeleton className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"></Skeleton>
          )}

          {chat && !isMsgLoading ? (
            <div className="ml-4">
              <h1 className="font-bold">{chat.chatName}</h1>
              {/* <div className="text-gray-500 text-[0.75rem]">
                {receivers &&
                Object.values(receivers).some((receiver) => receiver.isOnline)
                  ? "Online"
                  : `Online ${getDisplayTimeDiff(
                      new Date(
                        Object.values(receivers).sort(
                          (a, b) =>
                            new Date(b.lastLogined ?? "").getTime() -
                            new Date(a.lastLogined ?? "").getTime()
                        )[0].lastLogined ?? ""
                      )
                    )} ago`}
              </div> */}
            </div>
          ) : (
            <div className="ml-4 space-y-2">
              <Skeleton className="h-4 w-[240px]"></Skeleton>
              <Skeleton className="h-4 w-[120px]"></Skeleton>
            </div>
          )}
        </div>
        <div className="text-2xl flex items-center gap-4 ">
          <Button className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer">
            <Phone></Phone>
          </Button>
          <Link
            to={""}
            className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer"
          >
            <Video></Video>
          </Link>
          <Button
            className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer"
            onClick={() => setChatInfoOpen()}
          >
            <MoreHorizontal></MoreHorizontal>
          </Button>
        </div>
      </div>

      <div
        className="container h-[85%] overflow-y-scroll flex flex-col-reverse text-[0.9rem] py-4"
        ref={msgsContainerRef}
        onScroll={() => {
          const el = msgsContainerRef.current;
          if (!el) return;

          const isBottom =
            el.scrollHeight + el.scrollTop <= el.clientHeight + 1;

          if (isBottom && !isFetchMore) {
            console.log("Scrolled to bottom!");
            handleLoadMoreMessages();
          }
        }}
      >
        {typingUsers && typingUsers?.length > 0 && (
          <div className="flex justify-baseline items-center px-2 py-2 gap-4">
            <div
              className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(${typingUsers[0].avatar})` }}
            ></div>
            <TypingIndicator dotColor="bg-gray-400"></TypingIndicator>
          </div>
        )}

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
          : [1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="space-y-2 flex flex-col items-end my-2"
              >
                <Skeleton className="h-4 w-[240px] bg-black"></Skeleton>
                <Skeleton className="h-4 w-[80px] bg-black"></Skeleton>
              </div>
            ))}

        {isFetchMore && (
          <div className="flex justify-center items-center py-6">
            <div className="loader"></div>
          </div>
        )}
      </div>
      <div className="container h-[5%]">
        <form
          className="relative w-full flex items-center justify-between"
          autoComplete="off"
          onSubmit={handleSubmit((msg: IMessage) => {
            if (chat != undefined) {
              handleSendMessage({
                msgBody: msg.msgBody,
                user: msg.user.toString(),
                chatId,
                replyForMsg: msg.replyForMsg
                  ? (msg.replyForMsg as IMessage).id
                  : undefined,
              });
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
            onFocus={() => {
              console.log("user is typing");
              typeMessage({ variables: { chatId, isTyping: true } });
            }}
            onBlur={() => {
              console.log("user is stop typing");
              typeMessage({ variables: { chatId, isTyping: false } });
            }}
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
