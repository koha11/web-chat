import { FileText, Reply } from "lucide-react";
import { MyTooltip } from "../ui/my-tooltip";
import { useState } from "react";
import MessageActions from "./MessageActionBar";
import {
  getDisplaySendMsgTime,
  getDisplayTimeDiff,
  getTimeDiff,
  TimeTypeOption,
} from "../../utils/messageTime.helper";
import MessageStatus from "../../enums/MessageStatus.enum";
import { IUser } from "../../interfaces/user.interface";
import { IMessage } from "../../interfaces/messages/message.interface";
import { usePostMessage } from "../../hooks/message.hook";
import ReactPlayer from "react-player";
import MessageType from "@/enums/MessageType.enum";
import MarkdownMessage from "@/components/message/MarkdownMessage";
import EmojiPicker from "emoji-picker-react";

const SingleMsg = ({
  isLongGap,
  isSentMsg,
  msgSenderAvatar,
  msg,
  senderId,
  isFirstMsg,
  seenList,
  handleReplyMsg,
  receivers,
}: {
  isSentMsg: boolean;
  msgSenderAvatar: string;
  isLongGap: boolean;
  senderId: string;
  msg: IMessage;
  isFirstMsg: boolean;
  seenList: IUser[];
  receivers: { [userId: string]: IUser };
  handleReplyMsg: (msg: IMessage) => void;
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  const [postMessage] = usePostMessage({});

  return (
    <div
      className={`flex flex-col gap-1 px-2 single-msg ${isLongGap && "mt-2"}`}
    >
      {/* Hien thi noi dung tin nhan duoc phan hoi  */}
      {msg.replyForMsg && (
        <div
          className={`flex flex-col mt-2 text-[0.8rem] relative ${
            isSentMsg ? "items-end" : "items-baseline"
          }`}
        >
          <div className={`flex gap-2 mb-7`}>
            <Reply size={"14"}></Reply>{" "}
            {isSentMsg ? "You" : receivers[msg.user.toString()].fullname}{" "}
            replied to{" "}
            {receivers[(msg.replyForMsg as IMessage).user.toString()] !=
            undefined
              ? receivers[(msg.replyForMsg as IMessage).user.toString()]
                  .fullname
              : "yourself"}
          </div>
          <div
            className={`bg-[rgba(0,0,0,0.1)] pt-1 pb-5 px-2 rounded-2xl absolute ${
              isSentMsg ? "top-5 right-0" : "top-5 left-10"
            }`}
          >
            {(msg.replyForMsg as IMessage).msgBody}
          </div>
        </div>
      )}

      {/* Hien thi dau hieu tin nhan nay duoc chuyen tiep  */}
      {msg.isForwarded && (
        <div
          className={`flex flex-col mt-2 text-[0.8rem] relative ${
            isSentMsg ? "items-end" : "items-baseline"
          }`}
        >
          <div className={`flex gap-2 mb-1`}>
            <Reply size={"14"}></Reply>
            {!isSentMsg ? receivers[msg.user.toString()].fullname : "You"}{" "}
            forwarded a message
          </div>
        </div>
      )}

      {/* Phan chinh  */}
      <div
        className={`flex items-center gap-2 z-10 ${
          isSentMsg ? "justify-end" : "justify-baseline"
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Hien thi avatar neu co  */}
        {msgSenderAvatar == "" ? (
          <div
            className={`w-8 h-8 order-1`}
            style={{ backgroundImage: `url(${msgSenderAvatar})` }}
          ></div>
        ) : (
          MyTooltip(
            <div
              className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center order-1`}
              style={{ backgroundImage: `url(${msgSenderAvatar})` }}
            ></div>,
            receivers[msg.user.toString()].fullname,
            "order-1"
          )
        )}

        {/* Hien action  */}
        {(isHover || isOpen) && (
          <MessageActions
            isUnsendMsg={msg.status == MessageStatus.UNSEND}
            msgId={msg.id}
            isSentMsg={isSentMsg}
            isOpen={isOpen}
            setOpen={() => setOpen(!isOpen)}
            handleReplyMsg={() => handleReplyMsg(msg)}
            handleSendMsg={(chatId: string) => {
              postMessage({
                variables: {
                  user: senderId,
                  msgBody: msg.msgBody,
                  isForwarded: true,
                  chatId,
                },
              });
            }}
          ></MessageActions>
        )}

        {/* Hien thi noi dung tin nhan  */}
        {msg.type == MessageType.TEXT &&
          (msg.status == MessageStatus.UNSEND
            ? MyTooltip(
                <span
                  className={`py-2 px-3 text-xl text-[0.9rem] rounded-xl text-gray-200 italic ${
                    isSentMsg ? "bg-blue-500" : "bg-gray-200 text-gray-500"
                  } ${msg.isForwarded ? "" : ""}`}
                >
                  {isSentMsg
                    ? "You"
                    : receivers[msg.user.toString()].fullname.split(
                        " "
                      )[0]}{" "}
                  unsend a message
                </span>,
                `Send at ${getDisplaySendMsgTime(new Date(msg.createdAt!))}
              Unsend at ${getDisplaySendMsgTime(new Date(msg.unsentAt!))}`,
                "order-2"
              )
            : MyTooltip(
                <div
                  className={`py-2 px-3 text-xl text-[1rem] rounded-2xl order-2 text-justify   ${
                    isSentMsg ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  <MarkdownMessage text={msg.msgBody!}></MarkdownMessage>
                </div>,
                getDisplaySendMsgTime(new Date(msg.createdAt!)),
                "order-2 text-center max-w-[80%]"
              ))}

        {msg.type == MessageType.IMAGE &&
          MyTooltip(
            <img
              src={msg.file?.url}
              className={`rounded-3xl object-contain`}
            ></img>,
            getDisplaySendMsgTime(new Date(msg.createdAt!)),
            "order-2 max-w-[30%]"
          )}

        {msg.type == MessageType.VIDEO &&
          MyTooltip(
            <ReactPlayer
              src={msg.file?.url}
              className={`rounded-3xl`}
              controls
            ></ReactPlayer>,
            getDisplaySendMsgTime(new Date(msg.createdAt!)),
            "order-2 max-w-[30%]"
          )}

        {msg.type == MessageType.FILE &&
          MyTooltip(
            <a
              href={msg.file!.url}
              download
              className="py-2 px-3 flex gap-4 items-center bg-gray-400 rounded-3xl"
              target="_blank"
            >
              <FileText />
              <div>{msg.file?.filename}</div>
            </a>,
            getDisplaySendMsgTime(new Date(msg.createdAt!)),
            "order-2 max-w-[80%]"
          )}

        {msg.type == MessageType.AUDIO &&
          MyTooltip(
            <audio
              src={msg.file?.url}
              className={`rounded-3xl object-contain`}
              controls
            ></audio>,
            getDisplaySendMsgTime(new Date(msg.createdAt!)),
            "order-2 max-w-[70%]"
          )}
      </div>

      {/* Hien thi trang thai cua tin nhan */}
      <div className="flex items-center justify-end">
        {isSentMsg &&
          isFirstMsg &&
          ((msg.status == MessageStatus.SENT && (
            <span className="text-[0.7rem] mr-1 italic text-gray-600">
              Sent{" "}
              {getTimeDiff(
                new Date(),
                new Date(msg.createdAt!),
                TimeTypeOption.MINUTES
              ) == 0
                ? ""
                : getDisplayTimeDiff(new Date(msg.createdAt!)) + " ago"}
            </span>
          )) ||
            (msg.status == MessageStatus.SEEN &&
              seenList.map((user) =>
                MyTooltip(
                  <div
                    className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${user.avatar})` }}
                  ></div>,
                  user.fullname +
                    " seen at " +
                    getDisplaySendMsgTime(new Date(msg.seenList[user.id]))
                )
              )))}
      </div>
    </div>
  );
};

export default SingleMsg;
