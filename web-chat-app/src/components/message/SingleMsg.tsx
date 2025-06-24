import { MoreVertical, Reply, Share, Share2, SmileIcon } from "lucide-react";
import { Button } from "../ui/button";
import { MyTooltip } from "../ui/my-tooltip";
import { useState } from "react";
import MessageActions from "./MessageActionBar";
import { IMessage } from "../../interfaces/message.interface";
import {
  getDisplaySendMsgTime,
  getDisplayTimeDiff,
  getTimeDiff,
  TimeTypeOption,
} from "../../utils/messageTime.helper";
import MessageStatus from "../../enums/MessageStatus.enum";
import { IUser } from "../../interfaces/user.interface";

const SingleMsg = ({
  isLongGap,
  isSentMsg,
  msgSenderAvatar,
  msg,
  isFirstMsg,
  seenList,
  handleReplyMsg,
  receivers,
}: {
  isSentMsg: boolean;
  msgSenderAvatar: string;
  isLongGap: boolean;
  msg: IMessage;
  isFirstMsg: boolean;
  seenList: IUser[];
  receivers: { [userId: string]: IUser };
  handleReplyMsg: (msg: IMessage) => void;
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  if (msg.status == MessageStatus.REMOVED_ONLY_YOU) return <></>;

  return (
    <div
      className={`flex flex-col gap-1 px-2 single-msg ${isLongGap && "mt-4"}`}
    >
      {msg.replyForMsg && (
        <div
          className={`flex flex-col mt-2 text-[0.8rem] relative ${
            isSentMsg ? "items-end" : "items-baseline"
          }`}
        >
          <div className={`flex gap-2 mb-7`}>
            <Reply size={"14"}></Reply> You replied to{" "}
            {receivers[(msg.replyForMsg as IMessage).user.toString()] !=
            undefined
              ? receivers[(msg.replyForMsg as IMessage).user.toString()]
                  .fullname
              : "yourself"}
          </div>
          <div className="bg-[rgba(0,0,0,0.1)] pt-1 pb-5 px-2 rounded-2xl absolute top-5 right-0">
            {(msg.replyForMsg as IMessage).msgBody}
          </div>
        </div>
      )}

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
          ></MessageActions>
        )}

        {/* Hien thi noi dung tin nhan  */}
        {msg.status == MessageStatus.UNSEND
          ? MyTooltip(
              <span
                className={`py-2 px-3 text-xl text-[0.9rem] rounded-2xl text-gray-200 italic ${
                  isSentMsg ? "bg-blue-500" : "bg-gray-200 text-gray-500"
                }`}
              >
                {isSentMsg
                  ? "You"
                  : receivers[msg.user.toString()].fullname.split(" ")[0]}{" "}
                unsend a message
              </span>,
              `Send at ${getDisplaySendMsgTime(new Date(msg.createdAt!))}
              Unsend at ${getDisplaySendMsgTime(new Date(msg.updatedAt!))}`,
              "order-2"
            )
          : MyTooltip(
              <span
                className={`py-2 px-3 text-xl text-[1rem] rounded-2xl order-2 ${
                  isSentMsg ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.msgBody}
              </span>,
              getDisplaySendMsgTime(new Date(msg.createdAt!)),
              "order-2"
            )}
      </div>

      {/* Hien thi trang thai cua tin nhan  */}
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
