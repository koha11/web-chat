import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CONNECTABLE_USERS,
  GET_RECEIVED_CONNECT_REQUESTS,
  GET_SENT_CONNECT_REQUESTS,
  UPLOAD_USER_AVATAR,
} from "../services/userService";
import IModelConnection from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import { IUser } from "../interfaces/user.interface";

export const useGetConnectableUsers = ({
  userId,
  first = 10,
  after,
}: {
  userId: string;
  first?: number;
  after?: string;
}): IMyQueryResult<IModelConnection<IUser>> => {
  const myQuery = useQuery(GET_CONNECTABLE_USERS, {
    variables: { userId, first, after },
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
