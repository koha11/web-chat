import { useMutation, useQuery } from "@apollo/client";
import {
  GET_LAST_MESSAGES,
  GET_MESSAGES,
  POST_MESSAGE,
  REMOVE_MESSAGE,
  TYPE_MESSAGE,
  UNSEND_MESSAGE,
} from "../services/messageService";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import { IMessage } from "../interfaces/messages/message.interface";

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
    fetchMore: myQuery.fetchMore,
  };
};

export const useGetLastMessages = ({
  userId,
  isFetch,
}: {
  userId: string;
  isFetch: boolean;
  after?: string;
  first?: number;
}): IMyQueryResult<{ [chatId: string]: IMessage }> => {
  const myQuery = useQuery(GET_LAST_MESSAGES, {
    variables: { userId },
    skip: isFetch,
  });

  return {
    data: myQuery.data ? myQuery.data.lastMessages : undefined,
    loading: myQuery.loading,
    refetch: myQuery.refetch,
    subscribeToMore: myQuery.subscribeToMore,
    fetchMore: myQuery.refetch,
  };
};

export const usePostMessage = ({ first = 20 }: { first?: number }) => {
  return useMutation(POST_MESSAGE, {
    update(cache, { data }) {
      const addedMsg = data.postMessage;

      const existing = cache.readQuery<{
        messages: IModelConnection<IMessage>;
      }>({
        query: GET_MESSAGES,
        variables: { chatId: addedMsg.chat, first },
      });

      if (existing) {
        cache.writeQuery({
          query: GET_MESSAGES,
          variables: { chatId: addedMsg.chat, first },
          data: {
            messages: {
              ...existing.messages,
              edges: [
                {
                  __typename: "MessageEdge",
                  cursor: addedMsg.id,
                  node: addedMsg,
                },
                ...existing.messages.edges,
              ],
              pageInfo: {
                ...existing.messages.pageInfo,
                startCursor: addedMsg.id,
              },
            } as IModelConnection<IMessage>,
          },
        });
      }
    },
  });
};

export const useUnsendMessage = () => {
  return useMutation(UNSEND_MESSAGE);
};

export const useRemoveMessage = () => {
  return useMutation(REMOVE_MESSAGE);
};

export const useTypeMessage = () => {
  return useMutation(TYPE_MESSAGE);
};
