import { useEffect, useRef, useState } from "react";
import { IChat } from "../../interfaces/chat.interface";
import { IUser } from "../../interfaces/user.interface";
import { useForm } from "react-hook-form";
import {
  getDisplaySendMsgTime,
  getTimeDiff,
  TimeTypeOption,
} from "../../utils/messageTime.helper";
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
  const [usersMap, setUsersMap] = useState<{ [userId: string]: IUser } | null>(
    null
  );
  const [messages, setMessages] = useState<IMessageGroup[]>();
  const [isReplyMsgOpen, setReplyMsgOpen] = useState(false);
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

  const msgsContainerRef = useRef<HTMLDivElement>(null);

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

      // lang msg bi thay doi
      const unsubscribeMsgChanged = subscribeToMore({
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

      // lang msg dc gui den
      const unsubscribeMsgAdded = subscribeToMore({
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

  // set usersMap
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

  // refetch lai msg neu can thiet
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
    msgForm.setValue("msg.replyForMsg", msg);
    setReplyMsgOpen(true);
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

        {chat && usersMap && messages
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

      {chat && (
        <ChatInput
          form={msgForm}
          chat={chat}
          isReplyMsgOpen={isReplyMsgOpen}
          setReplyMsgOpen={setReplyMsgOpen}
        ></ChatInput>
      )}
    </section>
  );
};

export default ChatDetails;
