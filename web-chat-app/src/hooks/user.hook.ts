import { useQuery } from "@apollo/client";
import { GET_CONNECTABLE_USERS } from "../services/userService";
import { IMessage } from "../interfaces/messages/message.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import { IUser } from "../interfaces/user.interface";

export const useGetConnectableUsers = ({
  userId,
  first=10,
  after
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
