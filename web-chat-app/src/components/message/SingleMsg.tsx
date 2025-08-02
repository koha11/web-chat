import { Reply } from "lucide-react";
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
import ReactionMsgDialog from "./ReactionMsgDialog";
import MsgBody from "./MsgBody";

const SingleMsg = ({
  isLongGap,
  isSentMsg,
  msgSenderAvatar,
  msg,
  userId,
  isFirstMsg,
  seenList,
  handleReplyMsg,
  usersMap,
}: {
  isSentMsg: boolean;
  msgSenderAvatar: string;
  isLongGap: boolean;
  userId: string;
  msg: IMessage;
  isFirstMsg: boolean;
  seenList: IUser[];
  usersMap: { [userId: string]: IUser };
  handleReplyMsg: (msg: IMessage) => void;
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isReactionDialogOpen, setReactionDialogOpen] = useState(false);

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
            {isSentMsg ? "You" : usersMap[msg.user.toString()].fullname} replied
            to{" "}
            {usersMap[(msg.replyForMsg as IMessage).user.toString()] !=
            undefined
              ? usersMap[(msg.replyForMsg as IMessage).user.toString()].fullname
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
            {!isSentMsg ? usersMap[msg.user.toString()].fullname : "You"}{" "}
            forwarded a message
          </div>
        </div>
      )}

      {/* Phan chinh  */}
      <div
        className={`relative flex items-center gap-2 z-10 ${
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
            usersMap[msg.user.toString()].fullname,
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
            setOpen={setOpen}
            handleReplyMsg={() => handleReplyMsg(msg)}
            handleSendMsg={(chatId: string) => {
              postMessage({
                variables: {
                  user: userId,
                  msgBody: msg.msgBody,
                  isForwarded: true,
                  chatId,
                },
              });
            }}
          ></MessageActions>
        )}

        <div className="relative order-2">
          {/* Hien thi noi dung tin nhan  */}
          {msg.status == MessageStatus.UNSEND ? (
            MyTooltip(
              <span
                className={`py-2 px-3 text-xl text-[0.9rem] rounded-xl text-gray-200 italic ${
                  isSentMsg ? "bg-blue-500" : "bg-gray-200 text-gray-500"
                } ${msg.isForwarded ? "" : ""}`}
              >
                {isSentMsg
                  ? "You"
                  : usersMap[msg.user.toString()].fullname.split(" ")[0]}{" "}
                unsend a message
              </span>,
              `Send at ${getDisplaySendMsgTime(msg.createdAt!)}
              Unsend at ${getDisplaySendMsgTime(msg.unsentAt!)}`,
              "order-2"
            )
          ) : (
            <MsgBody isSentMsg={isSentMsg} msg={msg}></MsgBody>
          )}

          {/* hien thi reactions  */}
          {msg.reactions &&
            Object.keys(msg.reactions).map((userId) => {
              const reaction = msg.reactions![userId];
              const fullname = usersMap[userId].fullname;

              return MyTooltip(
                <span onClick={() => setReactionDialogOpen(true)}>
                  {reaction.emoji}
                </span>,
                fullname,
                "absolute z-20 -bottom-2 -right-2 rounded-full bg-gray-400 text-[0.8rem] p-0.5"
              );
            })}
        </div>
      </div>

      {/* Hien thi trang thai cua tin nhan */}
      <div className="flex items-center justify-end">
        {isSentMsg &&
          isFirstMsg &&
          ((msg.status == MessageStatus.SENT && (
            <span className="text-[0.7rem] mr-1 italic text-gray-600">
              Sent{" "}
              {getTimeDiff({
                firstTime: new Date(),
                secondTime: msg.createdAt!,
                option: TimeTypeOption.MINUTES,
              }) == 0
                ? ""
                : getDisplayTimeDiff(msg.createdAt!) + " ago"}
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

      {msg.reactions && (
        <ReactionMsgDialog
          reactions={msg.reactions}
          isOpen={isReactionDialogOpen}
          setOpen={setReactionDialogOpen}
          usersMap={usersMap}
        ></ReactionMsgDialog>
      )}
    </div>
  );
};

export default SingleMsg;
