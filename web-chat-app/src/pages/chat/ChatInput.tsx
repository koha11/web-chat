import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MessageType from "@/enums/MessageType.enum";
import {
  usePostMessage,
  usePostMediaMessage,
  useTypeMessage,
} from "@/hooks/message.hook";
import { IChat } from "@/interfaces/chat.interface";
import { IMessage } from "@/interfaces/messages/message.interface";
import { IUser } from "@/interfaces/user.interface";
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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useReactMediaRecorder } from "react-media-recorder";

const ChatInput = ({
  chat,
  isReplyMsgOpen,
  setReplyMsgOpen,
  form: { watch, register, setValue, resetField, handleSubmit },
  setMessages,
}: {
  chat: IChat;
  isReplyMsgOpen: boolean;
  setReplyMsgOpen: (open: boolean) => void;
  form: UseFormReturn<{
    msg: IMessage;
    files?: FileList;
  }>;
  setMessages: (msg: IMessage) => void;
}) => {
  const userId = Cookies.get("userId");

  // refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // states
  const [isAudioRecording, setAudioRecording] = useState(false);
  const [isAudioPlayed, setAudioPlayed] = useState(false);
  const [fileBlobUrls, setFileBlobUrls] = useState<
    { url: string; type: string }[]
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
          });
      }

      setFileBlobUrls(myFileBlobUrls);
    } else setFileBlobUrls([]);
  }, [watch("files")]);

  useEffect(() => {
    if (audioStatus == "stopped") {
      fetch(mediaBlobUrl!)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `${userId}.voice.${chat.id}`, {
            type: blob.type,
          });

          const dataTransfer = new DataTransfer();

          dataTransfer.items.add(file);

          setValue("files", dataTransfer.files);
        });
    }
  }, [audioStatus]);

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

  return (
    <div className="container min-h-[5%] flex items-center flex-col py-2">
      {watch("msg.replyForMsg") != undefined && (
        <Collapsible
          open={isReplyMsgOpen}
          onOpenChange={setReplyMsgOpen}
          className="w-full"
        >
          <CollapsibleContent className="flex flex-auto items-center justify-between border-t-2 w-full">
            <div className="py-1 space-y-2">
              <div className="font-semibold">
                Replying to{" "}
                {(chat.users as IUser[]).find(
                  (user) =>
                    user.id ==
                    (watch("msg.replyForMsg") as IMessage).user.toString()
                )?.fullname ?? "yourself"}
              </div>
              <div className="text-[0.7rem]">
                {(watch("msg.replyForMsg") as IMessage).msgBody}
              </div>
            </div>
            <Button
              variant={"outline"}
              className="h-6 w-4 rounded-full cursor-pointer border-0"
              onClick={() => {
                setReplyMsgOpen(false);
                resetField("msg.replyForMsg");
              }}
            >
              <X></X>
            </Button>
          </CollapsibleContent>
        </Collapsible>
      )}

      {fileBlobUrls.length > 0 && (
        <div className="flex items-center h-24 w-[50rem] px-8 py-2 gap-4 overflow-x-auto overflow-y-hidden bg-gray-200 whitespace-nowrap">
          <div className="h-12 w-12 bg-gray-400 p-4 flex items-center justify-between">
            <ImagePlus></ImagePlus>
          </div>

          {fileBlobUrls.map(({ url, type }, index) => {
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
                <div className="py-2 px-3 flex gap-4 items-center bg-gray-400 rounded-3xl text-sm">
                  <FileText></FileText>
                  <div>{url}</div>
                </div>
              );

            if (!myComponent) return <></>;

            return (
              <div
                key={index}
                className={`relative h-12 shrink-0 ${
                  type.startsWith("application") ? "w-24" : "w-12"
                }`}
              >
                {myComponent}
                <Button
                  className="absolute -top-1 -right-1 cursor-pointer"
                  size={"no_style"}
                  onClick={() => {
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
            (msg.msgBody != "" || (files && files.length)) &&
            !isSendingMsg &&
            !isSendingMedia
          ) {
            console.log("submit");
            setMessages({
              ...msg,
              createdAt: new Date(),
              chat: chat.id,
              id: msg.msgBody!,
              type: MessageType.TEXT,
              user: userId!,
              seenList: {},
            });

            const data = {
              msgBody: msg.msgBody,
              chatId: chat.id,
              replyForMsg: msg.replyForMsg
                ? (msg.replyForMsg as IMessage).id
                : undefined,
              files: files?.length == 0 ? undefined : files,
            };

            resetField("msg.msgBody");
            resetField("msg.replyForMsg");
            resetField("files");

            setAudioRecording(false);
            setReplyMsgOpen(false);

            await handleSendMessage(data);
          }
        })}
      >
        <Label htmlFor="uploaded-image" className="rounded-full cursor-pointer">
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
            <audio className="w-full" ref={audioRef} src={mediaBlobUrl}></audio>

            {audioStatus != "stopped" ? (
              <Button
                type="button"
                onClick={async () => {
                  stopRecording();

                  const blob = await fetch(mediaBlobUrl!).then((res) =>
                    res.blob()
                  );

                  const file = new File([blob], `${userId}.voice.${chat.id}`, {
                    type: blob.type,
                  });

                  const dataTransfer = new DataTransfer();

                  dataTransfer.items.add(file);

                  setValue("files", dataTransfer.files);
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
                typeMessage({ variables: { chatId: chat.id, isTyping: true } });
              }}
              onBlur={() => {
                typeMessage({
                  variables: { chatId: chat.id, isTyping: false },
                });
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
                setValue("msg.msgBody", watch("msg.msgBody") + emojiData.emoji);
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
  );
};

export default ChatInput;
