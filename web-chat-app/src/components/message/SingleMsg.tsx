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
import MessageType from "@/enums/MessageType.enum";
import SystemMsg from "./SystemMsg";
import { IChatUsersInfo } from "@/interfaces/chat.interface";
import { Link, useNavigate } from "react-router-dom";
import ProgressSpinnerSquare from "../ui/progress-spinner-square";

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
  setMediaId,
  handleNavigateToReplyMsg,
  uploadProgress,
}: {
  isSentMsg: boolean;
  msgSenderAvatar: string;
  isLongGap: boolean;
  userId: string;
  msg: IMessage;
  isFirstMsg: boolean;
  seenList: string[];
  usersMap: { [userId: string]: IChatUsersInfo };
  handleReplyMsg: (msg: IMessage) => void;
  setMediaId: (msgId: string) => void;
  handleNavigateToReplyMsg: (
    e: React.MouseEvent,
    msgId: string
  ) => Promise<void>;
  uploadProgress: { [uploadId: string]: number };
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isReactionDialogOpen, setReactionDialogOpen] = useState(false);

  const [postMessage] = usePostMessage({});

  const currUser = usersMap[msg.user];

  const replyMsg = msg.replyForMsg ? (msg.replyForMsg as IMessage) : undefined;

  const replyMsgUserId = replyMsg ? replyMsg.user : undefined;

  const targetName = replyMsgUserId
    ? replyMsgUserId == userId
      ? "yourself"
      : usersMap[replyMsgUserId].nickname.split(" ")[0]
    : "";
  const name = isSentMsg ? "you" : currUser.nickname.split(" ")[0];

  return (
    <div
      className={`flex flex-col gap-1 px-2 single-msg ${isLongGap && "mt-2"}`}
      id={msg.id}
    >
      {/* Hien thi noi dung tin nhan duoc phan hoi  */}
      {replyMsg && (
        <div
          className={`flex flex-col mt-2 text-[0.8rem] relative ${
            isSentMsg ? "items-end" : "items-baseline"
          }`}
        >
          <div className={`flex gap-2 mb-7 capitalize`}>
            <Reply size={"14"}></Reply> {name} replied to {targetName}
          </div>
          <a
            className={`bg-[rgba(0,0,0,0.1)] pt-1 pb-5 px-2 rounded-2xl absolute cursor-pointer ${
              isSentMsg ? "top-5 right-0" : "top-5 left-10"
            }`}
            href={`#${replyMsg.id}`}
            onClick={async (e) =>
              await handleNavigateToReplyMsg(e, replyMsg.id)
            }
          >
            {(msg.replyForMsg as IMessage).msgBody}
          </a>
        </div>
      )}

      {/* Hien thi dau hieu tin nhan nay duoc chuyen tiep  */}
      {msg.isForwarded && (
        <div
          className={`flex flex-col mt-2 text-[0.8rem] relative ${
            isSentMsg ? "items-end" : "items-baseline"
          }`}
        >
          <div className={`flex gap-2 mb-1 capitalize`}>
            <Reply size={"14"}></Reply>
            {name} forwarded a message
          </div>
        </div>
      )}

      {/* Phan chinh  */}
      {msg.type == MessageType.SYSTEM ? (
        <SystemMsg
          msg={msg}
          userId={userId}
          usersMap={usersMap}
          key={msg.id}
        ></SystemMsg>
      ) : msg.type == MessageType.FILE && !msg.file ? (
        // loading file
        <div className={`relative flex items-center gap-2 z-10 justify-end`}>
          {MyTooltip({
            hover: (
              <ProgressSpinnerSquare
                progress={uploadProgress[msg.id] ?? 0}
                className=""
                size={192}
              ></ProgressSpinnerSquare>
            ),
            content: getDisplaySendMsgTime(msg.createdAt!),
            className: "",
            id: msg.id,
          })}
        </div>
      ) : (
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
            MyTooltip({
              hover: (
                <div
                  className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center order-1`}
                  style={{ backgroundImage: `url(${msgSenderAvatar})` }}
                ></div>
              ),
              content: name,
              className: "order-1",
              id: msg.id + msgSenderAvatar,
            })
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

          <div className="relative order-2 w-fit">
            {/* Hien thi noi dung tin nhan  */}
            {msg.status == MessageStatus.UNSEND ? (
              MyTooltip({
                hover: (
                  <span
                    className={`py-2 px-3 text-xl text-[0.9rem] rounded-xl text-gray-200 italic ${
                      isSentMsg ? "bg-blue-500" : "bg-gray-200 text-gray-500"
                    } ${msg.isForwarded ? "" : ""}`}
                  >
                    {name} unsend a message
                  </span>
                ),
                content: `Send at ${getDisplaySendMsgTime(msg.createdAt!)}
              Unsend at ${getDisplaySendMsgTime(msg.unsentAt!)}`,
                className: "order-2",
                id: msg.id,
              })
            ) : (
              <MsgBody
                isSentMsg={isSentMsg}
                msg={msg}
                setMediaId={setMediaId}
              ></MsgBody>
            )}

            {/* hien thi reactions  */}
            {msg.reactions &&
              Object.keys(msg.reactions).map((userId) => {
                const reaction = msg.reactions![userId];
                const user = usersMap[userId];
                const fullname = user ? user.fullname : "undefined user";

                return MyTooltip({
                  hover: (
                    <span onClick={() => setReactionDialogOpen(true)}>
                      {reaction.emoji}
                    </span>
                  ),
                  content: fullname,
                  className:
                    "absolute z-20 -bottom-2 -right-2 rounded-full bg-gray-400 text-[0.8rem] p-0.5",
                  id: msg.id + "-reactions",
                });
              })}
          </div>
        </div>
      )}

      {/* Hien thi trang thai cua tin nhan */}
      {!(msg.type == MessageType.FILE && !msg.file) && (
        <div className="flex items-center justify-end">
          {msg.type != MessageType.SYSTEM &&
            isSentMsg &&
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
                seenList.map((userId) =>
                  MyTooltip({
                    hover: (
                      <div
                        className="w-4 h-4 rounded-full bg-contain bg-no-repeat bg-center"
                        style={{
                          backgroundImage: `url(${usersMap[userId].avatar})`,
                        }}
                      ></div>
                    ),
                    content:
                      usersMap[userId].fullname +
                      "seen at " +
                      getDisplaySendMsgTime(new Date(msg.seenList[userId])),
                    id: msg.id + "-" + userId,
                  })
                )))}
        </div>
      )}

      {/* hien thi reaction dialog  */}
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
