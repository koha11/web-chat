import {
  OperationVariables,
  SubscribeToMoreFunction,
  useQuery,
} from "@apollo/client";
import { GET_CHATS } from "../services/chatService";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection, {
  Edge,
} from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import { IUser } from "../interfaces/user.interface";

export const useGetChats = (
  userId: string
): IMyQueryResult<IModelConnection<IChat>> => {
  const myQuery = useQuery(GET_CHATS, { variables: { userId } });

  if (myQuery.error) throw myQuery.error;

  let data: IModelConnection<IChat> | undefined;

  if (myQuery.data) {
    const queryData = myQuery.data.chats;
    data = {
      edges: queryData.edges.map((edge: Edge<IChat>) => {
        const chat = edge.node;

        return {
          ...edge,
          node: {
            ...chat,
            chatAvatar:
              chat.chatAvatar == ""
                ? (chat.users as IUser[]).find((user) => user.id != userId)
                    ?.avatar ?? ""
                : chat.chatAvatar,
            chatName:
              chat.chatName == ""
                ? (chat.users as IUser[]).find((user) => user.id != userId)
                    ?.fullname ?? ""
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
  };
};
