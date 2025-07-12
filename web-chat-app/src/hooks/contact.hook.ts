import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CONTACTS,
  HANDLE_REQUEST,
  SEND_REQUEST,
} from "../services/contactService";
import IContact from "../interfaces/contact.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import { IUser } from "../interfaces/user.interface";
import { GET_CONNECTABLE_USERS } from "../services/userService";

export const useGetContacts = ({
  userId,
  after,
  first,
}: {
  userId: string;
  first?: number;
  after?: string;
}): IMyQueryResult<IModelConnection<IContact>> => {
  const myQuery = useQuery(GET_CONTACTS, {
    variables: { userId, first, after },
    skip: !userId,
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.contacts,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useSendRequest = (data: {
  userId?: string;
  first?: number;
  after?: string;
}) => {
  return useMutation(SEND_REQUEST);
  // return useMutation(SEND_REQUEST, {
  //   update(cache, { data }) {
  //     const changedContact = data.sendRequest;

  //     const existing = cache.readQuery<{
  //       contacts: IModelConnection<IUser>;
  //     }>({
  //       query: GET_CONNECTABLE_USERS,
  //       variables: { userId },
  //     });

  //     if (existing) {
  //       cache.writeQuery({
  //         query: GET_CONNECTABLE_USERS,
  //         variables: { chatId: addedMsg.chat, first },
  //         data: {
  //           messages: {
  //             ...existing.messages,
  //             edges: [
  //               {
  //                 __typename: "MessageEdge",
  //                 cursor: addedMsg.id,
  //                 node: addedMsg,
  //               },
  //               ...existing.messages.edges,
  //             ],
  //             pageInfo: {
  //               ...existing.messages.pageInfo,
  //               startCursor: addedMsg.id,
  //             },
  //           } as IModelConnection<IMessage>,
  //         },
  //       });
  //     }
  //   },
  // });
};

export const useHandleRequest = (data: {
  userId?: string;
  first?: number;
  after?: string;
}) => {
  return useMutation(HANDLE_REQUEST);
};
