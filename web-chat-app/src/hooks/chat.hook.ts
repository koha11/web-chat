import {
  OperationVariables,
  SubscribeToMoreFunction,
  useQuery,
} from "@apollo/client";
import { GET_CHATS } from "../services/chatService";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection from "../interfaces/modelConnection.interface";

export const useGetChats = (
  userId: string
): {
  data: IModelConnection<IChat>;
  loading: boolean;
  subscribeToMore: SubscribeToMoreFunction<any, OperationVariables>;
} => {
  const myQuery = useQuery(GET_CHATS, { variables: { userId } });

  if (myQuery.error) throw myQuery.error;

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.chats,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
  };
};
