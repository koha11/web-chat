import { useEffect, useRef, useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { useForm } from "react-hook-form";
import { getTimeDiff, TimeTypeOption } from "../../utils/messageTime.helper";
import { GroupMsg } from "../../components/message/MsgGroup";
import IMessageGroup from "../../interfaces/messages/messageGroup.interface";
import { Skeleton } from "../../components/ui/skeleton";
import { useGetMessages } from "../../hooks/message.hook";
import {
  MESSAGE_ADDED_SUB,
  MESSAGE_CHANGED_SUB,
  MESSAGE_TYPING_SUB,
} from "../../services/messageService";
import { IMessage } from "../../interfaces/messages/message.interface";
import IModelConnection, {
  Edge,
} from "../../interfaces/modelConnection.interface";
import { TypingIndicator } from "../../components/ui/typing-indicator";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Cookies from "js-cookie";
import { useGetContacts } from "@/hooks/contact.hook";
import { arraysEqualUnordered } from "@/utils/array.helper";
import Loading from "@/components/ui/loading";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { ChatDetailProvider } from "@/hooks/useChatDetailContext";

const ChatDetails = ({
  chat,
  hasUpdated,
  setUpdatedChatMap,
  setChatInfoOpen,
  setMediaId,
  chatList,
  choosenUsers,
  setChoosenUsers,
  isNewChat,
  fetchMap,
  setFetchMap,
}: {
  chat: IChat | undefined;
  hasUpdated: boolean;
  setUpdatedChatMap: Function;
  setChatInfoOpen: Function;
  setMediaId: (msgId: string) => void;
  choosenUsers: IUser[];
  setChoosenUsers: Function;
  chatList: IChat[];
  isNewChat: boolean;
  fetchMap: {
    chat: boolean;
    msg: boolean;
  };
  setFetchMap: Function;
}) => {
  const userId = Cookies.get("userId")!;
  const { id } = useParams();

  // states
  const [messages, setMessages] = useState<IMessageGroup[]>();
  const [isReplyMsgOpen, setReplyMsgOpen] = useState(false);
  const [isFetchMore, setFetchMore] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<IUser[]>();

  const [isContactListOpen, setContactListOpen] = useState(true);
  const [myChat, setMyChat] = useState<IChat | undefined>(chat);
  const [uploadProgress, setUploadProgress] = useState<{
    [uploadId: string]: number;
  }>({});

  // hooks
  const { data: contactConnection, loading: isContactsLoading } =
    useGetContacts({});

  const {
    data: messagesConnection,
    loading: isMsgLoading,
    refetch: refetchMessages,
    subscribeToMore,
    fetchMore,
  } = useGetMessages({
    chatId: myChat?.id,
    first: 20,
    after: undefined,
    // search: "e",
  });

  // useForm
  const msgForm = useForm<{
    msg: IMessage;
    files?: FileList;
  }>({
    defaultValues: {
      msg: {
        msgBody: "",
      },
    },
  });

  const { register } = useForm<{ search: string }>();

  // Ref
  const msgsContainerRef = useRef<HTMLDivElement>(null);
  const typingAudioRef = useRef<HTMLAudioElement>(null);

  // useEffect

  // tien xu ly du lieu cho msg va lang nghe cac event socket cua msg
  useEffect(() => {
    if (messagesConnection) {
      // convert tung single msg thanh 1 group theo time string
      const grouped = messagesConnection.edges.reduce<IMessageGroup[]>(
        (acc, edge) => {
          const msg = edge.node;
          const time = new Date(msg.createdAt!);
          const last = acc[acc.length - 1];

          if (
            last &&
            getTimeDiff({
              firstTime: new Date(last.timeString),
              secondTime: time,
              option: TimeTypeOption.MINUTES,
            }) < 20
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
      setFetchMap((old: any) => {
        return { ...old, msg: true };
      });

      // lang msg bi thay doi
      const unsubscribeMsgChanged = subscribeToMore({
        document: MESSAGE_CHANGED_SUB,
        variables: { chatId: myChat?.id },
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

      // lang msg dc gui den
      const unsubscribeMsgAdded = subscribeToMore({
        document: MESSAGE_ADDED_SUB,
        variables: { chatId: myChat?.id },
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

      // lang nghe hanh vi nhap tin nhan
      const unsubscribeMsgTyping = subscribeToMore({
        document: MESSAGE_TYPING_SUB,
        variables: { chatId: myChat?.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const messageTyping = subscriptionData.data.messageTyping as {
            typingUser: IUser;
            isTyping: boolean;
          };

          if (messageTyping.isTyping) typingAudioRef.current?.play();
          else typingAudioRef.current?.pause();

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

  // refetch lai msg neu can thiet
  useEffect(() => {
    setFetchMap((old: any) => {
      return { ...old, chat: true };
    });

    if (hasUpdated && myChat) {
      refetchMessages();
      setUpdatedChatMap((old: any) => {
        return { ...old, [myChat.id]: true };
      });
    }

    msgsContainerRef.current?.scrollTo(0, 0);
  }, [myChat]);

  useEffect(() => {
    setMyChat(chat);
  }, [chat]);

  useEffect(() => {
    if (chatList && !chat) {
      const newUserIds = choosenUsers.map((user) => user.id);

      const myChat = chatList.find((chat) => {
        const chatUserIds = (chat.users as IUser[])
          .filter((user) => user.id != userId)
          .map((user) => user.id);

        return arraysEqualUnordered(chatUserIds, newUserIds);
      });

      if (myChat) {
        setMyChat(myChat);
      } else {
        setMyChat(undefined);
      }
    }
  }, [choosenUsers]);

  // useEffect(() => {
  //   if (!hash) return;
  //   console.log(hash);
  //   const container = msgsContainerRef.current;

  //   if (!container) return;

  //   const el = container.querySelector(hash);
  //   if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  // }, [hash]);

  useEffect(() => {
    window.onclick = () => setContactListOpen(false);
  }, []);

  // HANDLERs
  const handleReplyMsg = (msg: IMessage) => {
    msgForm.setValue("msg.replyForMsg", msg);
    setReplyMsgOpen(true);
  };

  const handleLoadMoreMessages = async ({ until }: { until?: string }) => {
    if (messagesConnection?.pageInfo.hasNextPage) {
      setFetchMore(true);

      await fetchMore({
        variables: {
          after: messagesConnection?.pageInfo.endCursor,
          until,
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

  const handleNavigateToReplyMsg = async (
    e: React.MouseEvent,
    msgId: string
  ) => {
    // check that msgId is in messages
    if (!messages) {
      e.preventDefault();
      return;
    }

    const msgIds = messages
      .map((msgGroup) => msgGroup.messages.map((msg) => msg.id))
      .flat();

    if (!msgIds.includes(msgId)) await handleLoadMoreMessages({ until: msgId });
  };

  return (
    <ChatDetailProvider
      userId={userId}
      usersMap={myChat ? myChat.usersInfo : {}}
      handleReplyMsg={handleReplyMsg}
      setMediaId={setMediaId}
      handleNavigateToReplyMsg={handleNavigateToReplyMsg}
      uploadProgress={uploadProgress}
      setUploadProgress={setUploadProgress}
      chat={myChat}
      chatId={id!}
    >
      <section
        className="flex-5 h-full p-4 bg-white rounded-2xl flex flex-col justify-center items-center"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
      >
        <audio
          src="/assets/sounds/typing.wav"
          ref={typingAudioRef}
          loop
        ></audio>

        {/* header la input de them thanh vien  */}
        {isNewChat ? (
          <div className="container flex items-center justify-between h-[10%] border-b-2 border-black gap-4">
            <div>To: </div>
            {choosenUsers.map((user) => (
              <Badge
                variant={"outline"}
                className="bg-blue-200 font-semibold text-blue-400"
              >
                <span>{user.fullname}</span>

                <Button
                  variant={"no_style"}
                  size={"no_style"}
                  className="hover:bg-gray-200 hover:opacity-50 cursor-pointer p-1 rounded-full"
                  onClick={() =>
                    setChoosenUsers((prev: IUser[]) =>
                      prev.filter((myUser) => myUser.id != user.id)
                    )
                  }
                >
                  <X></X>
                </Button>
              </Badge>
            ))}

            <div
              className="relative flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                className="border-0"
                {...register("search")}
                onFocus={() => setContactListOpen(true)}
                autoComplete="false"
              ></Input>

              <div
                hidden={
                  !isContactListOpen ||
                  choosenUsers.length == contactConnection?.edges.length
                }
                className="absolute top-8 left-0 max-h-[20rem] overflow-y-auto w-[30%] shadow-2xl bg-white rounded-md py-2 px-2 z-20"
                onMouseEnter={(e) => e.stopPropagation()}
                onMouseLeave={(e) => e.stopPropagation()}
              >
                <div className="font-semibold mb-2">Your contacts</div>

                {isContactsLoading ? (
                  <Loading></Loading>
                ) : (
                  contactConnection?.edges.map((edge) => {
                    const contact = edge.node.users.filter(
                      (user) => user.id != userId
                    )[0];

                    if (choosenUsers.find((user) => user.id == contact.id))
                      return <></>;

                    return (
                      <div
                        className={`flex items-center gap-4 p-2 rounded-md hover:bg-gray-200 cursor-pointer`}
                        onClick={() => {
                          const newUsers = [...choosenUsers, contact];
                          setChoosenUsers(newUsers);
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
                          style={{
                            backgroundImage: `url(${contact.avatar})`,
                          }}
                        ></div>
                        <div>{contact.fullname}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          // header mac dinh
          <ChatHeader setChatInfoOpen={setChatInfoOpen}></ChatHeader>
        )}

        <div
          className="container h-[85%] overflow-y-scroll flex flex-col-reverse text-[0.9rem] py-4"
          ref={msgsContainerRef}
          onScroll={() => {
            const el = msgsContainerRef.current;
            if (!el) return;

            const isBottom =
              el.scrollHeight + el.scrollTop <= el.clientHeight + 1;

            if (isBottom && !isFetchMore) {
              handleLoadMoreMessages({});
            }
          }}
        >
          {/* <Button
          className="fixed rounded-full cursor-pointer opacity-50 left-[50%] translate-x-[-50%]"
          variant={"outline"}
          onClick={() => {
            msgsContainerRef.current?.scrollTo(0, 0);
          }}
        >
          <ArrowDown></ArrowDown>
        </Button> */}

          {/* typing user UI */}
          {typingUsers && typingUsers?.length > 0 && (
            <div className="flex justify-baseline items-center px-2 py-2 gap-4">
              <div
                className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                style={{ backgroundImage: `url(${typingUsers[0].avatar})` }}
              ></div>
              <TypingIndicator dotColor="bg-gray-400"></TypingIndicator>
            </div>
          )}

          {/* UI Doan chat mac dinh  */}
          {!isNewChat &&
            (myChat == undefined
              ? ""
              : fetchMap.chat && fetchMap.msg
              ? messages!.map((msg, index) => {
                  return (
                    <GroupMsg
                      key={msg.timeString}
                      isFirstGroup={index == 0}
                      messages={msg.messages}
                      timeString={msg.timeString}
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
                )))}

          {/* UI doan chat khi tao chat moi  */}
          {isNewChat &&
            (choosenUsers.length == 0
              ? ""
              : myChat == undefined
              ? ""
              : myChat && messages && !isMsgLoading
              ? messages.map((msg, index) => {
                  return (
                    <GroupMsg
                      key={msg.timeString}
                      isFirstGroup={index == 0}
                      messages={msg.messages}
                      timeString={msg.timeString}
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
                )))}

          {/* Hieu ung loading khi fetch them tin nhan moi  */}
          {isFetchMore && (
            <div className="flex justify-center items-center py-6">
              <div className="loader"></div>
            </div>
          )}
        </div>

        {/* Thanh nhap tin nhan  */}
        {choosenUsers.length > 0 || !isNewChat ? (
          <ChatInput
            form={msgForm}
            isReplyMsgOpen={isReplyMsgOpen}
            setReplyMsgOpen={setReplyMsgOpen}
            choosenUsers={choosenUsers}
            setMessage={(msg: IMessage) => {
              setMessages((prev) => {
                const time = new Date(msg.createdAt!);
                const last = prev ? prev[0] : undefined;

                if (
                  prev &&
                  last &&
                  getTimeDiff({
                    firstTime: new Date(last.timeString),
                    secondTime: time,
                    option: TimeTypeOption.MINUTES,
                  }) < 20
                ) {
                  return [
                    {
                      messages: [msg, ...last.messages],
                      timeString: last.timeString,
                    },
                    ...prev.slice(1),
                  ];
                } else {
                  return [
                    ...(prev ?? []),
                    {
                      timeString: time.toISOString(),
                      messages: [msg],
                    },
                  ];
                }
              });
            }}
          ></ChatInput>
        ) : (
          <div className="container h-[10%] flex items-center flex-col py-2"></div>
        )}
      </section>
    </ChatDetailProvider>
  );
};

export default ChatDetails;
