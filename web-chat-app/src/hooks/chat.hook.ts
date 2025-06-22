import {
  OperationVariables,
  SubscribeToMoreFunction,
  useQuery,
} from "@apollo/client";
import { GET_CHATS } from "../services/chatService";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";

export const useGetChats = (
  userId: string
): IMyQueryResult<IModelConnection<IChat>> => {
  const myQuery = useQuery(GET_CHATS, { variables: { userId } });

  if (myQuery.error) throw myQuery.error;

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.chats,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
  };
};
