import {
  OperationVariables,
  QueryResult,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  GET_LAST_MESSAGES,
  GET_MESSAGES,
  POST_MESSAGE,
} from "../services/messageService";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import { IMessage } from "../interfaces/message.interface";
import IMessageGroup from "../interfaces/messageGroup.interface";
import { getTimeDiff, TimeTypeOption } from "../utils/messageTime.helper";

export const useGetMessages = ({
  chatId,
  after,
  first,
}: {
  chatId: string;
  first?: number;
  after?: string;
}): IMyQueryResult<IModelConnection<IMessage>> => {
  const myQuery = useQuery(GET_MESSAGES, {
    variables: { chatId, first, after },
    skip: !chatId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.messages,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
  };
};

export const useGetLastMessages = (
  userId: string,
  isFetch: boolean
): IMyQueryResult<{ [chatId: string]: IMessage }> => {
  const myQuery = useQuery(GET_LAST_MESSAGES, {
    variables: { userId },
    skip: isFetch,
  });

  return {
    data: myQuery.data ? myQuery.data.lastMessages : undefined,
    loading: myQuery.loading,
    refetch: myQuery.refetch,
    subscribeToMore: myQuery.subscribeToMore,
  };
};

export const usePostMessage = () => {
  return useMutation(POST_MESSAGE, { variables: {} });
};
