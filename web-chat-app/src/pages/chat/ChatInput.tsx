import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MessageType from "@/enums/MessageType.enum";
import { usePostChat } from "@/hooks/chat.hook";
import {
  usePostMessage,
  usePostMediaMessage,
  useTypeMessage,
} from "@/hooks/message.hook";
import { IChat } from "@/interfaces/chat.interface";
import { IMessage } from "@/interfaces/messages/message.interface";
import { IUser } from "@/interfaces/user.interface";
import { strimText } from "@/utils/text.helper";
import { randomInt } from "crypto";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import Cookies from "js-cookie";
import {
  X,
  ImagePlus,
  FileText,
  Mic,
  Square,
  Play,
  Pause,
  Smile,
  Send,
  Hand,
  Image,
  FileTextIcon,
  Plus,
  Microchip,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useReactMediaRecorder } from "react-media-recorder";
import { useNavigate, useNavigation } from "react-router-dom";
import MessageStatus from "@/enums/MessageStatus.enum";
import MyEmojiPicker from "@/components/ui/my-emoji-picker";
import { useApolloClient } from "@apollo/client";
import { UPLOAD_PROGRESS_SUB } from "@/services/messageService";
import { size } from "zod";
import { updateMsgCache } from "@/utils/updateCache.helper";

const ChatInput = ({
  chat,
  isReplyMsgOpen,
  setReplyMsgOpen,
  form: { watch, register, setValue, resetField, handleSubmit },
  setMessage,
  choosenUsers,
  setUploadProgress,
}: {
  chat?: IChat;
  isReplyMsgOpen: boolean;
  setReplyMsgOpen: (open: boolean) => void;
  form: UseFormReturn<{
    msg: IMessage;
    files?: FileList;
  }>;
  setMessage: (msg: IMessage) => void;
  choosenUsers: IUser[];
  setUploadProgress: Function;
}) => {
  const userId = Cookies.get("userId")!;
  const client = useApolloClient();
  const navigate = useNavigate();

  // refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // states
  const [isAudioRecording, setAudioRecording] = useState(false);
  const [isAudioPlayed, setAudioPlayed] = useState(false);
  const [fileBlobUrls, setFileBlobUrls] = useState<
    { url: string; type: string; filename: string; size: number }[]
  >([]);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // mutations
  const [postMessage, { loading: isSendingMsg }] = usePostMessage({
    first: 20,
  });
  const [postMediaMessage, { loading: isSendingMedia }] = usePostMediaMessage({
    first: 20,
  });
  const [typeMessage] = useTypeMessage();
  const [postChat] = usePostChat({ userId });

  // hooks
  const {
    status: audioStatus,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({ video: false });

  // useEffect

  // hien thi preview cho file sap duoc gui di
  useEffect(() => {
    const files = watch("files");

    if (files) {
      let myFileBlobUrls = [] as any[];

      for (let file of files) {
        if (!file.type.startsWith("audio"))
          myFileBlobUrls.push({
            url: URL.createObjectURL(file),
            type: file.type,
            filename: file.name,
            size: file.size,
          });
      }

      setFileBlobUrls(myFileBlobUrls);
    } else setFileBlobUrls([]);
  }, [watch("files")]);

  // luu voice cua user
  useEffect(() => {
    if (audioStatus == "stopped") {
      fetch(mediaBlobUrl!)
        .then((res) => res.blob())
        .then((blob) => {
          const ext = blob.type.startsWith("audio") ? "mp3" : "mp4";
          const file = new File(
            [blob],
            `${userId}-voice-${new Date()
              .toISOString()
              .replace(/[:.]/g, "-")}.${ext}`,
            {
              type: blob.type,
            }
          );

          const dataTransfer = new DataTransfer();

          dataTransfer.items.add(file);

          setValue("files", dataTransfer.files);
        });
    }
  }, [audioStatus]);

  // clear msg UI
  useEffect(() => {
    if (isSendingMedia || isSendingMsg) {
      resetField("msg.msgBody");
      resetField("msg.replyForMsg");

      setAudioRecording(false);
      setReplyMsgOpen(false);
      resetField("files");
    }
  }, [isSendingMedia, isSendingMsg]);

  useEffect(() => {
    window.addEventListener(
      "click",
      () => isEmojiPickerOpen && setEmojiPickerOpen(false)
    );

    return () =>
      window.removeEventListener(
        "click",
        () => isEmojiPickerOpen && setEmojiPickerOpen(false)
      );
  }, []);

  // Handlers
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

    if (fileArr && fileArr.length > 0) {
      const { data } = await postMediaMessage({
        variables: {
          chatId,
          replyForMsg,
          isForwarded,
          files: fileArr,
          filesInfo: [fileBlobUrls[0] ? fileBlobUrls[0].size : 5000],
        },
      });

      const uploadIds = data.postMediaMessage;

      for (let uploadId of uploadIds) {
        setMessage({
          createdAt: new Date(),
          chat: chatId!,
          id: uploadId,
          type: MessageType.FILE,
          status: MessageStatus.SENT,
          user: userId!,
          seenList: {},
        });

        const sub = client
          .subscribe({ query: UPLOAD_PROGRESS_SUB, variables: { uploadId } })
          .subscribe({
            next: ({ data }) => {
              const { pct, phase, url, publicId, error, addedMsg } =
                data.uploadProgress;

              setUploadProgress((old: { [uploadId: string]: number }) => {
                return {
                  ...old,
                  [uploadId]: pct,
                };
              });

              if (phase === "DONE") {
                updateMsgCache({
                  cache: client.cache,
                  option: "ADD",
                  newMsg: addedMsg.node,
                });

                sub.unsubscribe();
                // persist url/publicId to your message, etc.
              }

              if (phase === "ERROR") {
                sub.unsubscribe();
                // handle error
              }
            },
            error: (e) => {
              // subscription transport error
              console.log(e);
            },
          });
      }
    }

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

  const handleUploadFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const current = watch("files"); // FileList | undefined
    const dt = new DataTransfer();
    const newFiles = e.target.files;

    if (current) Array.from(current).forEach((f) => dt.items.add(f));
    if (newFiles) Array.from(newFiles).forEach((f) => dt.items.add(f));

    // update RHF value (triggers validation/dirty if you want)
    setValue("files", dt.files, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="container min-h-[5%] flex items-center flex-col py-2">
      {watch("msg.replyForMsg") != undefined && chat && (
        <Collapsible
          open={isReplyMsgOpen}
          onOpenChange={setReplyMsgOpen}
          className="w-full"
        >
          <CollapsibleContent className="flex flex-auto items-center justify-between border-t-2 w-full">
            <div className="py-1 space-y-2">
              <div className="font-semibold">
                Replying to{" "}
                {userId == (watch("msg.replyForMsg") as IMessage).user
                  ? "yourself"
                  : chat.usersInfo[(watch("msg.replyForMsg") as IMessage).user]
                      .nickname}
              </div>

              <div className="text-[0.7rem]">
                {(watch("msg.replyForMsg") as IMessage).msgBody}
              </div>
            </div>

            <Button
              variant={"outline"}
              className="h-6 w-4 rounded-full cursor-pointer border-0"
              onClick={() => {
                setValue("msg.replyForMsg", undefined);
                setReplyMsgOpen(false);
              }}
            >
              <X></X>
            </Button>
          </CollapsibleContent>
        </Collapsible>
      )}

      <form
        className="relative w-full flex items-center justify-between gap-2"
        autoComplete="off"
        ref={formRef}
        onSubmit={handleSubmit(async ({ msg, files }) => {
          if (files?.length) {
            for (let file of files) if (file.size > 10_000_000) return;
          }

          if (
            (msg.msgBody != "" || (files && files.length)) &&
            !isSendingMsg &&
            !isSendingMedia
          ) {
            let chatId = chat?.id;

            // neu chat chua ton tai thi tao chat trc
            if (!chatId) {
              if (choosenUsers.length == 0) return;

              const users = [...choosenUsers.map((user) => user.id), userId];

              const { data: newChat } = await postChat({
                variables: { users },
              });

              chatId = newChat.postChat.id;
            }

            if (!files || files.length == 0)
              setMessage({
                ...msg,
                createdAt: new Date(),
                chat: chatId!,
                id: msg.msgBody!,
                type: MessageType.TEXT,
                user: userId!,
                seenList: {},
              });

            const data = {
              msgBody: msg.msgBody,
              chatId: chatId!,
              replyForMsg: msg.replyForMsg
                ? (msg.replyForMsg as IMessage).id
                : undefined,
              files: files?.length == 0 ? undefined : files,
            };

            await handleSendMessage({ ...data, files });

            if (!chat && choosenUsers.length > 0) navigate(`/m/${chatId}`);
          }
        })}
      >
        {/* External blue plus (left) */}
        <Label
          htmlFor="uploaded-image"
          className="h-9 w-9 rounded-full cursor-pointer grid place-items-center text-black shadow hover:opacity-90"
          title="Add"
        >
          <Plus size={16}></Plus>
        </Label>

        <Button
          className="h-9 w-9 rounded-full cursor-pointer grid place-items-center text-black shadow hover:opacity-90"
          variant={"outline"}
          type="button"
          onClick={() => {
            setAudioRecording(true);
            startRecording();
          }}
        >
          <Mic size={16}></Mic>
        </Button>

        {/* AUDIO or TEXT COMPOSER BUBBLE */}
        {isAudioRecording ? (
          <div className="rounded-2xl flex-1 bg-zinc-800 px-4 py-2 text-zinc-100 relative">
            <audio className="w-full" ref={audioRef} src={mediaBlobUrl}></audio>

            {audioStatus != "stopped" ? (
              <Button
                type="button"
                onClick={() => stopRecording()}
                className="absolute top-[50%] -translate-y-[50%] left-2"
                variant={"ghost"}
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
                variant={"ghost"}
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
                variant={"ghost"}
              >
                <Pause />
              </Button>
            )}

            <Button
              className="absolute right-2 top-2 rounded-full cursor-pointer"
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
          </div>
        ) : (
          /* TEXT composer bubble (dark) */
          <div className="flex-1 rounded-2xl bg-gray-300 text-black py-1 px-2 overflow-x-auto overflow-y-hidden max-w-[50rem]">
            {/* Inline attachments tray (only when files selected) */}
            {fileBlobUrls.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap px-1 pb-1 min-h-[3.5rem]">
                {/* Add tile inside tray */}
                <Label
                  htmlFor="uploaded-image"
                  className="shrink-0 h-12 w-12 rounded-md bg-zinc-700 hover:bg-zinc-600 grid place-items-center text-zinc-200 cursor-pointer"
                  title="Add more"
                >
                  <ImagePlus className="h-6 w-6" />
                </Label>

                {fileBlobUrls.map(({ url, type, filename }, index) => {
                  let myComponent;

                  if (type.startsWith("image"))
                    myComponent = (
                      <img
                        src={url}
                        className="object-cover rounded-md h-full w-full"
                      ></img>
                    );

                  if (type.startsWith("video"))
                    myComponent = (
                      <video
                        src={url}
                        className="object-cover rounded-md h-full w-full"
                        disablePictureInPicture
                      ></video>
                    );

                  if (type.startsWith("application"))
                    myComponent = (
                      <div className="py-2 px-3 flex gap-2 items-center bg-zinc-700 rounded-md text-xs w-full">
                        <FileTextIcon></FileTextIcon>
                        <div>{strimText(filename, 15)}</div>
                      </div>
                    );

                  if (!myComponent) return <></>;

                  return (
                    <div
                      key={index}
                      className={`relative h-12 shrink-0 ${
                        type.startsWith("application") ? "w-fit" : "w-12"
                      }`}
                    >
                      {myComponent}
                      <Button
                        className="absolute -top-1 -right-1 cursor-pointer h-5 w-5 rounded-full bg-black/70 text-white p-0 grid place-items-center"
                        size={"no_style"}
                        onClick={(e) => {
                          e.preventDefault();
                          URL.revokeObjectURL(url);

                          setFileBlobUrls((old) =>
                            old.filter(({ url: oldUrl }) => oldUrl != url)
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
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Input row (transparent inside dark bubble) */}
            <div className="relative flex items-center gap-2 mt-1">
              <Input
                {...register("msg.msgBody")}
                className="rounded-3xl w-full shadow-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-black placeholder:text-zinc-400"
                placeholder="Aa"
                onFocus={() => {
                  if (chat)
                    typeMessage({
                      variables: { chatId: chat.id, isTyping: true },
                    });
                }}
                onBlur={() => {
                  if (chat)
                    typeMessage({
                      variables: { chatId: chat.id, isTyping: false },
                    });
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && formRef.current)
                    formRef.current.requestSubmit();
                }}
              ></Input>

              <Button
                className="absolute right-0 top-0 cursor-pointer hover:opacity-60"
                variant={"no_style"}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEmojiPickerOpen(!isEmojiPickerOpen);
                }}
                title="Emoji"
              >
                <Smile></Smile>
              </Button>

              <MyEmojiPicker
                onEmojiSelect={({ native: emoji, unified }: any) => {
                  setValue("msg.msgBody", watch("msg.msgBody") + emoji);
                }}
                open={isEmojiPickerOpen}
                style={{
                  position: "absolute",
                  top: -410,
                  right: 40,
                  zIndex: 20,
                }}
                onClick={(e) => e.stopPropagation()}
              ></MyEmojiPicker>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <Input
          id="uploaded-image"
          type="file"
          hidden
          multiple={true}
          {...register("files")}
          onChange={handleUploadFiles}
        ></Input>

        {/* Send & quick reaction (right side) */}
        <div className="flex items-center gap-2">
          <Button
            className="rounded-full cursor-pointer"
            variant={"secondary"}
            type="submit"
          >
            <Send></Send>
          </Button>

          <Button
            className="rounded-full cursor-pointer"
            variant={"secondary"}
            onClick={async () => {
              if (chat && !isSendingMsg) {
                setMessage({
                  createdAt: new Date(),
                  chat: chat.id,
                  id: chat.chatEmoji,
                  msgBody: chat.chatEmoji,
                  type: MessageType.TEXT,
                  user: userId!,
                  seenList: {},
                  status: MessageStatus.SENT,
                });

                await handleSendMessage({
                  chatId: chat.id,
                  msgBody: chat.chatEmoji,
                });
              }
            }}
          >
            {chat?.chatEmoji}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
