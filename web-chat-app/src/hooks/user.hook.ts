import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CHAT_ADDABLE_USERS,
  GET_CONNECTABLE_USERS,
  GET_RECEIVED_CONNECT_REQUESTS,
  GET_SENT_CONNECT_REQUESTS,
  GET_USERS,
  UPLOAD_USER_AVATAR,
} from "../services/userService";
import IModelConnection from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import { IUser } from "../interfaces/user.interface";

export const useGetUser = ({
  userId,
}: {
  userId: string;
}): IMyQueryResult<IUser> => {
  const myQuery = useQuery(GET_USERS, {
    variables: { userId },
    skip: !userId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.users[0],
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useGetConnectableUsers = ({
  userId,
  first = 10,
  after,
  search,
}: {
  userId: string;
  first?: number;
  after?: string;
  search?: string;
}): IMyQueryResult<IModelConnection<IUser>> => {
  const myQuery = useQuery(GET_CONNECTABLE_USERS, {
    variables: { userId, first, after, search },
    skip: !userId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.connectableUsers,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useGetChatAddableUsers = ({
  userId,
  chatId,
  first = 10,
  after,
  search,
}: {
  userId: string;
  chatId: string;
  first?: number;
  after?: string;
  search?: string;
}): IMyQueryResult<IModelConnection<IUser>> => {
  const myQuery = useQuery(GET_CHAT_ADDABLE_USERS, {
    variables: { userId, chatId, first, after, search },
    skip: !userId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.chatAddableUsers,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useGetReceivedConnectRequests = ({
  first = 10,
}: {
  first?: number;
  after?: string;
}): IMyQueryResult<IModelConnection<IUser>> => {
  const myQuery = useQuery(GET_RECEIVED_CONNECT_REQUESTS, {
    variables: { first },
  });

  return {
    data:
      myQuery.data == undefined
        ? undefined
        : myQuery.data.receivedConnectRequests,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useGetSentConnectRequests = ({
  first = 10,
}: {
  first?: number;
  after?: string;
}): IMyQueryResult<IModelConnection<IUser>> => {
  const myQuery = useQuery(GET_SENT_CONNECT_REQUESTS, {
    variables: { first },
  });

  return {
    data:
      myQuery.data == undefined ? undefined : myQuery.data.sentConnectRequests,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useUploadUserAvatar = () => {
  return useMutation(UPLOAD_USER_AVATAR);
};
