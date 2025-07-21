import { useEffect, useRef, useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import {
  FileText,
  Hand,
  Image,
  ImagePlus,
  Mic,
  MoreHorizontal,
  Pause,
  Phone,
  Play,
  Send,
  Smile,
  Square,
  Video,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
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
  usePostMediaMessage,
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
import { useReactMediaRecorder } from "react-media-recorder";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import ChatHeader from "./ChatHeader";

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
  const [usersMap, setUsersMap] = useState<{ [userId: string]: IUser }>({});
  const [messages, setMessages] = useState<IMessageGroup[]>();
  const [isOpen, setOpen] = useState(false);
  const [isFetchMore, setFetchMore] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<IUser[]>();
  const [isAudioRecording, setAudioRecording] = useState(false);
  const [isAudioPlayed, setAudioPlayed] = useState(false);
  const [fileObjects, setFileObjects] = useState<
    {
      url: string;
      filename: string;
      file: File;
      type: string;
    }[]
  >([]);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

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
  const [postMediaMessage] = usePostMediaMessage({ first: 20 });

  const [typeMessage] = useTypeMessage();

  // useForm
  const { register, handleSubmit, resetField, setValue, watch } = useForm<{
    msg: IMessage;
    files?: FileList;
  }>({
    defaultValues: {
      msg: {
        msgBody: "",
      },
    },
  });

  const {
    status: audioStatus,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({ video: false });

  const msgsContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect
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

      // lang msg dc gui den
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

      // lang msg bi thay doi
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

      // lang nghe hanh vi nhap tin nhan
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
    if (chat) {
      const users = chat.users as IUser[];
      
      let myMap = {} as { [userId: string]: IUser };

      users.forEach((user) => {
        myMap[user.id] = user;
      });

      setUsersMap(myMap);
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

  useEffect(() => {
    const files = watch("files");

    if (files) {
      let myfileObjects = [] as any[];
      for (let file of files) {
        myfileObjects.push({
          url: URL.createObjectURL(file),
          file,
          filename: file.name,
          type: file.type,
        });
      }
      setFileObjects((old) => [...old, ...myfileObjects]);
    } else setFileObjects([]);
  }, [watch("files")]);

  useEffect(() => {
    if (audioStatus == "stopped") {
      fetch(mediaBlobUrl!)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `${userId}.voice.${chatId}`, {
            type: blob.type,
          });

          const dataTransfer = new DataTransfer();

          dataTransfer.items.add(file);

          setValue("files", dataTransfer.files);
        });
    }
  }, [audioStatus]);

  // HANDLERs
  const handleReplyMsg = (msg: IMessage) => {
    setValue("msg.replyForMsg", msg);
    setOpen(true);
  };

  const handleSendMessage = async ({
    chatId,
    msgBody,
    replyForMsg,
    isForwarded,
    files,
  }: {
    msgBody?: string;
    chatId: string;
    replyForMsg?: string;
    isForwarded?: boolean;
    files?: FileList;
  }) => {
    const fileArr = files ? Array.from(files) : undefined;

    if (fileArr)
      await postMediaMessage({
        variables: {
          chatId,
          replyForMsg,
          isForwarded,
          files: fileArr,
        },
      });

    if (msgBody)
      await postMessage({
        variables: {
          chatId,
          msgBody,
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
      <ChatHeader
        chat={chat}
        isMsgLoading={isMsgLoading}
        setChatInfoOpen={setChatInfoOpen}
      ></ChatHeader>

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
        {typingUsers && typingUsers?.length > 0 && (
          <div className="flex justify-baseline items-center px-2 py-2 gap-4">
            <div
              className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(${typingUsers[0].avatar})` }}
            ></div>
            <TypingIndicator dotColor="bg-gray-400"></TypingIndicator>
          </div>
        )}

        {chat && messages
          ? messages.map((msg, index) => {
              return (
                <GroupMsg
                  userId={userId}
                  key={msg.timeString}
                  messages={msg.messages}
                  timeString={msg.timeString}
                  usersMap={usersMap}
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
        {watch("msg.replyForMsg") != undefined && (
          <Collapsible open={isOpen} onOpenChange={setOpen} className="w-full">
            <CollapsibleContent className="flex flex-auto items-center justify-between border-t-2 w-full">
              <div className="py-1 space-y-2">
                <div className="font-semibold">
                  Replying to{" "}
                  {usersMap[
                    (watch("msg.replyForMsg") as IMessage).user.toString()
                  ]?.fullname ?? "yourself"}
                </div>
                <div className="text-[0.7rem]">
                  {(watch("msg.replyForMsg") as IMessage).msgBody}
                </div>
              </div>
              <Button
                variant={"outline"}
                className="h-6 w-4 rounded-full cursor-pointer border-0"
                onClick={() => {
                  setOpen(false);
                  resetField("msg.replyForMsg");
                }}
              >
                <X></X>
              </Button>
            </CollapsibleContent>
          </Collapsible>
        )}

        {fileObjects.length > 0 &&
          !fileObjects.some((obj) => obj.type.startsWith("audio")) && (
            <div className="flex items-center h-24 w-[50rem] px-8 py-2 gap-4 overflow-x-auto overflow-y-hidden bg-gray-200 whitespace-nowrap">
              <div className="h-12 w-12 bg-gray-400 p-4 flex items-center justify-between">
                <ImagePlus></ImagePlus>
              </div>
              {fileObjects.map((obj, index) => {
                let myComponent;

                if (obj.type.startsWith("image"))
                  myComponent = (
                    <img
                      src={obj.url}
                      className="object-cover rounded-md h-full w-full"
                    ></img>
                  );

                if (obj.type.startsWith("video"))
                  myComponent = (
                    <video
                      src={obj.url}
                      className="object-cover rounded-md h-full w-full"
                      disablePictureInPicture
                    ></video>
                  );

                if (obj.type.startsWith("application"))
                  myComponent = (
                    <div className="py-2 px-3 flex gap-4 items-center bg-gray-400 rounded-3xl text-sm">
                      <FileText></FileText>
                      <div>{obj.filename}</div>
                    </div>
                  );

                if (!myComponent) return <></>;

                return (
                  <div
                    key={index}
                    className={`relative h-12 shrink-0 ${
                      obj.type.startsWith("application") ? "w-24" : "w-12"
                    }`}
                  >
                    {myComponent}
                    <Button
                      className="absolute -top-1 -right-1 cursor-pointer"
                      size={"no_style"}
                      onClick={() => {
                        URL.revokeObjectURL(obj.url);
                        setFileObjects((old) =>
                          old.filter((oldObject) => oldObject.url != obj.url)
                        );

                        const fileList = watch("files");

                        if (!fileList) return;

                        const dt = new DataTransfer();
                        Array.from(fileList).forEach((file, fileIndex) => {
                          if (fileIndex !== index) {
                            dt.items.add(file);
                          }
                        });

                        setValue("files", dt.files);
                      }}
                    >
                      <X></X>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

        <form
          className="relative w-full flex items-center justify-between gap-4"
          autoComplete="off"
          onSubmit={handleSubmit(async ({ msg, files }) => {
            if (files?.length) {
              for (let file of files) if (file.size > 10_000_000) return;
            }

            if (
              chat != undefined &&
              (msg.msgBody != "" || (files && files.length))
            ) {
              await handleSendMessage({
                msgBody: msg.msgBody,
                chatId,
                replyForMsg: msg.replyForMsg
                  ? (msg.replyForMsg as IMessage).id
                  : undefined,
                files: files?.length == 0 ? undefined : files,
              });

              resetField("msg.msgBody");
              resetField("msg.replyForMsg");
              resetField("files");

              setAudioRecording(false);
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

          {isAudioRecording ? (
            <Button
              className="rounded-full cursor-pointer"
              variant={"outline"}
              type="button"
              onClick={() => {
                stopRecording();
                clearBlobUrl();
                resetField("files");
                setAudioRecording(false);
              }}
            >
              <X></X>
            </Button>
          ) : (
            <Button
              className="rounded-full cursor-pointer"
              variant={"outline"}
              type="button"
              onClick={() => {
                startRecording();
                setAudioRecording(true);
              }}
            >
              <Mic></Mic>
            </Button>
          )}

          <Input
            id="uploaded-image"
            type="file"
            hidden
            multiple={true}
            {...register("files")}
          ></Input>

          {isAudioRecording ? (
            <div className="rounded-3xl flex-auto bg-gray-200 px-4 py-2 text-gray-500 relative">
              <audio
                className="w-full"
                ref={audioRef}
                src={mediaBlobUrl}
              ></audio>

              {audioStatus != "stopped" ? (
                <Button
                  type="button"
                  onClick={async () => {
                    stopRecording();
                  }}
                  className="absolute top-[50%] -translate-y-[50%] left-2"
                >
                  <Square />
                </Button>
              ) : !isAudioPlayed ? (
                <Button
                  type="button"
                  onClick={() => {
                    setAudioPlayed(true);
                    audioRef.current?.play();
                  }}
                  className="absolute top-[50%] -translate-y-[50%] left-2"
                >
                  <Play />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    audioRef.current?.pause();
                    setAudioPlayed(false);
                  }}
                  className="absolute top-[50%] -translate-y-[50%] left-2"
                >
                  <Pause />
                </Button>
              )}
            </div>
          ) : (
            <div className="flex-auto relative">
              <Input
                {...register("msg.msgBody")}
                className="rounded-3xl w-full bg-gray-200 px-4 py-2 text-gray-500"
                placeholder="Aa"
                onFocus={() => {
                  typeMessage({ variables: { chatId, isTyping: true } });
                }}
                onBlur={() => {
                  typeMessage({ variables: { chatId, isTyping: false } });
                }}
              ></Input>
              <Button
                className="absolute right-0 top-0 cursor-pointer hover:opacity-60"
                variant={"no_style"}
                type="button"
                onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                <Smile></Smile>
              </Button>
              <EmojiPicker
                open={isEmojiPickerOpen}
                lazyLoadEmojis={true}
                emojiStyle={EmojiStyle.FACEBOOK}
                height={400}
                searchDisabled
                onEmojiClick={(emojiData) => {
                  setValue(
                    "msg.msgBody",
                    watch("msg.msgBody") + emojiData.emoji
                  );
                }}
                style={{
                  position: "absolute",
                  top: -410,
                  right: 40,
                  zIndex: 20,
                }}
              />
            </div>
          )}

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
