import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATS, POST_CHAT } from "../services/chatService";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection, {
  Edge,
} from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import { IUser } from "../interfaces/user.interface";

export const useGetChats = ({
  userId,
  after,
  first = 10,
}: {
  userId: string;
  after?: string;
  first?: number;
}): IMyQueryResult<IModelConnection<IChat>> => {
  const myQuery = useQuery(GET_CHATS, { variables: { userId, after, first } });

  if (myQuery.error) throw myQuery.error;

  let data: IModelConnection<IChat> | undefined;

  if (myQuery.data) {
    const queryData = myQuery.data.chats;
    data = {
      edges: queryData.edges.map((edge: Edge<IChat>) => {
        const chat = edge.node;
        const users = chat.users as IUser[];
        const isGroupChat = chat.users.length > 2;

        const defaultChatAvatar =
          users.find((user) => user.id != userId)?.avatar ?? "";

        const defaultChatName = users.find(
          (user) => user.id != userId
        )?.fullname;

        const defaultGroupChatName = users.reduce<String>((acc, user) => {
          if (user.id == userId) return acc;

          return acc == ""
            ? acc + user.fullname.split(" ")[0]
            : acc + ", " + user.fullname.split(" ")[0];
        }, "");

        return {
          ...edge,
          node: {
            ...chat,
            chatAvatar:
              chat.chatAvatar == "" ? defaultChatAvatar : chat.chatAvatar,
            chatName:
              chat.chatName == ""
                ? isGroupChat
                  ? defaultGroupChatName
                  : defaultChatName
                : chat.chatName,
          },
        };
      }),
      pageInfo: queryData.pageInfo,
    };
  }

  return {
    data: data,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const usePostChat = () => {
  return useMutation(POST_CHAT);
};
