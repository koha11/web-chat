import { useEffect, useRef, useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import {
  Forward,
  Hand,
  Image,
  ImageDown,
  ImagePlus,
  MoreHorizontal,
  Phone,
  PictureInPicture,
  Send,
  Video,
  X,
} from "lucide-react";
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
import IModelConnection, {
  Edge,
} from "../../interfaces/modelConnection.interface";
import { TypingIndicator } from "../../components/ui/typing-indicator";
import UserType from "../../enums/UserType.enum";
import { useMakeCall } from "../../hooks/chat.hook";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [imageObjects, setImageObjects] = useState<
    {
      url: string;
      filename: string;
      file: File;
      type: string;
    }[]
  >([]);

  const uploadInputRef = useRef<HTMLInputElement>(null);

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
  const [makeCall] = useMakeCall();
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
      const users = chat.users as IUser[];
      let myMap = {} as { [userId: string]: IUser };
      users.forEach((user) => {
        if (user.id != userId) myMap[user.id] = user;
      });

      setReceivers(myMap);
      setSender(users.find((user) => user.id == userId));
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

  return (
    <section
      className="flex-5 h-full p-4 bg-white rounded-2xl flex flex-col justify-center items-center"
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
                (receiver) =>
                  receiver.isOnline || receiver.userType == UserType.CHATBOT
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
              <div className="text-gray-500 text-[0.75rem]">
                {receivers &&
                  Object.keys(receivers).length > 0 &&
                  (Object.values(receivers).some(
                    (receiver) =>
                      receiver.isOnline || receiver.userType == UserType.CHATBOT
                  )
                    ? "Online"
                    : `Online ${getDisplayTimeDiff(
                        new Date(
                          Object.values(receivers).sort(
                            (a, b) =>
                              new Date(b.lastLogined ?? "").getTime() -
                              new Date(a.lastLogined ?? "").getTime()
                          )[0].lastLogined ?? ""
                        )
                      )} ago`)}
              </div>
            </div>
          ) : (
            <div className="ml-4 space-y-2">
              <Skeleton className="h-4 w-[240px]"></Skeleton>
              <Skeleton className="h-4 w-[120px]"></Skeleton>
            </div>
          )}
        </div>
        <div className="text-2xl flex items-center gap-4 ">
          <Button
            className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer"
            onClick={() => {
              makeCall({ variables: { chatId, hasVideo: false } });
              window.open(
                `/call?has_video=false&initialize_video=false&room_id=${chatId}`,
                "_blank",
                "width=1300,height=600,location=no,toolbar=no"
              );
            }}
          >
            <Phone></Phone>
          </Button>
          <Button
            className="p-2 rounded-full hover:bg-gray-200 bg-white text-black cursor-pointer"
            onClick={() => {
              makeCall({ variables: { chatId, hasVideo: true } });
              window.open(
                `/call?has_video=true&initialize_video=true&room_id=${chatId}`,
                "_blank",
                "width=1300,height=600,location=no,toolbar=no"
              );
            }}
          >
            <Video></Video>
          </Button>
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
            handleLoadMoreMessages();
          }
        }}
      >
        {/* {imageObjects.length > 0 &&
          imageObjects.map((imgObj, index) => {
            return (
              <a
                href={imgObj.url}
                download={imgObj.filename}
                className="text-blue-600 underline"
              >
                {imgObj.filename}
              </a>
            );  
          })} */}

        {typingUsers && typingUsers?.length > 0 && (
          <div className="flex justify-baseline items-center px-2 py-2 gap-4">
            <div
              className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(${typingUsers[0].avatar})` }}
            ></div>
            <TypingIndicator dotColor="bg-gray-400"></TypingIndicator>
          </div>
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
      <div className="container min-h-[5%] flex items-center flex-col py-2">
        {watch("replyForMsg") != undefined && (
          <Collapsible open={isOpen} onOpenChange={setOpen} className="w-full">
            <CollapsibleContent className="flex flex-auto items-center justify-between border-t-2 w-full">
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
        {imageObjects.length > 0 && (
          <div className="flex items-center h-24 w-[50rem] px-8 py-2 gap-4 overflow-x-auto overflow-y-hidden bg-gray-200 whitespace-nowrap">
            <div className="h-12 w-12 bg-gray-400 p-4 flex items-center justify-between">
              <ImagePlus></ImagePlus>
            </div>
            {imageObjects.map((imgObj, index) => (
              <div key={index} className="relative h-12 w-12 shrink-0">
                <img
                  src={imgObj.url}
                  className="object-cover rounded-md h-full w-full"
                ></img>
                <Button
                  className="absolute -top-1 -right-1 cursor-pointer"
                  size={"no_style"}
                  onClick={() => {
                    URL.revokeObjectURL(imgObj.url);
                    setImageObjects((old) =>
                      old.filter((oldObject) => oldObject.url != imgObj.url)
                    );

                    const input = uploadInputRef.current;
                    if (!input || !input.files) return;

                    const dt = new DataTransfer();
                    Array.from(input.files).forEach((file, fileIndex) => {
                      if (fileIndex !== index) {
                        dt.items.add(file);
                      }
                    });

                    input.files = dt.files;
                  }}
                >
                  <X></X>
                </Button>
              </div>
            ))}
          </div>
        )}
        <form
          className="relative w-full flex items-center justify-between gap-4"
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
          <Label
            htmlFor="uploaded-image"
            className="rounded-full cursor-pointer"
          >
            <Image></Image>
          </Label>

          <Input
            id="uploaded-image"
            type="file"
            hidden
            accept="image/*"
            multiple={true}
            ref={uploadInputRef}
            onChange={(e) => {
              const files = e.target.files!;
              let myImageObjects = [] as any[];

              for (let file of files) {
                myImageObjects.push({
                  url: URL.createObjectURL(file),
                  file,
                  filename: file.name,
                  type: file.type,
                });
              }

              setImageObjects((old) => [...old, ...myImageObjects]);
            }}
          ></Input>

          <Input
            {...register("msgBody", { required: true })}
            className="rounded-3xl flex-auto bg-gray-200 px-4 py-2 text-gray-500"
            placeholder="Aa"
            onFocus={() => {
              typeMessage({ variables: { chatId, isTyping: true } });
            }}
            onBlur={() => {
              typeMessage({ variables: { chatId, isTyping: false } });
            }}
          ></Input>

          <Button
            className="rounded-full cursor-pointer"
            variant={"secondary"}
            type="submit"
          >
            <Send></Send>
          </Button>
          <Button className="rounded-full cursor-pointer" variant={"secondary"}>
            <Hand></Hand>
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ChatDetails;
