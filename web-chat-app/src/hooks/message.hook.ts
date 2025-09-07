import { useMutation, useQuery } from "@apollo/client";
import {
  GET_FILE_MESSAGES,
  GET_LAST_MESSAGES,
  GET_MESSAGES,
  POST_MEDIA_MESSAGE,
  POST_MESSAGE,
  REACT_MESSAGE,
  REMOVE_MESSAGE,
  TYPE_MESSAGE,
  UNSEND_MESSAGE,
} from "../services/messageService";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import { IMessage } from "../interfaces/messages/message.interface";
import { updateMsgCache } from "@/utils/updateCache.helper";

export const useGetMessages = ({
  chatId,
  after,
  first,
  search,
  skip,
}: {
  chatId?: string;
  first?: number;
  after?: string;
  search?: string;
  skip?: boolean;
}): IMyQueryResult<IModelConnection<IMessage>> => {
  const myQuery = useQuery(GET_MESSAGES, {
    variables: { chatId, first, after, search },
    skip: !chatId || skip,
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

export const useGetFileMessages = ({
  chatId,
  after,
  first,
  isMediaFile,
}: {
  chatId: string;
  first?: number;
  after?: string;
  isMediaFile: boolean;
}): IMyQueryResult<IModelConnection<IMessage>> => {
  const myQuery = useQuery(GET_FILE_MESSAGES, {
    variables: { chatId, first, after, isMediaFile },
    skip: !chatId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.fileMessages,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const usePostMessage = ({ first = 20 }: { first?: number }) => {
  return useMutation(POST_MESSAGE, {
    update(cache, { data }) {
      const addedMsg = data.postMessage;
      updateMsgCache({ cache, option: "ADD", newMsg: addedMsg, first });
    },
  });
};

export const usePostMediaMessage = ({ first = 20 }: { first?: number }) => {
  return useMutation(POST_MEDIA_MESSAGE);
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

export const useReactMessage = () => {
  return useMutation(REACT_MESSAGE);
};
