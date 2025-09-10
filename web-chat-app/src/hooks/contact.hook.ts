import { useMutation, useQuery } from "@apollo/client";
import {
  GET_CONTACTS,
  HANDLE_REQUEST,
  REMOVE_CONNECT,
  SEND_REQUEST,
} from "../services/contactService";
import IContact from "../interfaces/contact.interface";
import IModelConnection from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import {
  GET_CONNECTABLE_USERS,
  GET_RECEIVED_CONNECT_REQUESTS,
  GET_SENT_CONNECT_REQUESTS,
} from "@/services/userService";
import { IUser } from "@/interfaces/user.interface";
import Cookies from "js-cookie";
import ContactRelationship from "@/enums/ContactRelationship.enum";

export const useGetContacts = ({
  after,
  first = 10,
  search,
}: {
  first?: number;
  after?: string;
  search?: string;
}): IMyQueryResult<IModelConnection<IContact>> => {
  const myQuery = useQuery(GET_CONTACTS, {
    variables: { first, after, search },
  });

  return {
    data: myQuery.data == undefined ? undefined : myQuery.data.contacts,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useSendRequest = ({ first = 10 }: { first?: number }) => {
  const myUserId = Cookies.get("userId");

  return useMutation(SEND_REQUEST, {
    update(cache, { data }) {
      const sendRequest = data.sendRequest as IContact;

      const existing = cache.readQuery<{
        sentConnectRequests: IModelConnection<IUser>;
      }>({
        query: GET_SENT_CONNECT_REQUESTS,
        variables: { first },
      });

      const user = sendRequest.users.filter((user) => user.id != myUserId)[0];

      if (existing) {
        cache.writeQuery({
          query: GET_SENT_CONNECT_REQUESTS,
          variables: { first },
          data: {
            sentConnectRequests: {
              ...existing.sentConnectRequests,
              edges: [
                ...existing.sentConnectRequests.edges,
                {
                  ...existing.sentConnectRequests.edges[0],
                  cursor: sendRequest.id,
                  node: user,
                },
              ],
              pageInfo: {
                ...existing.sentConnectRequests.pageInfo,
                startCursor: sendRequest.id,
              },
            } as IModelConnection<IUser>,
          },
        });
      }
    },
  });
};

export const useHandleRequest = ({
  userId,
  first = 10,
  after,
}: {
  userId: string;
  first?: number;
  after?: string;
}) => {
  return useMutation(HANDLE_REQUEST, {
    update(cache, { data }) {
      const handleRequest = data.handleRequest as IContact;

      const existingSentConnectRequests = cache.readQuery<{
        sentConnectRequests: IModelConnection<IUser>;
      }>({
        query: GET_SENT_CONNECT_REQUESTS,
        variables: { first },
      });

      if (existingSentConnectRequests) {
        const newEdges =
          existingSentConnectRequests.sentConnectRequests.edges.filter(
            (edge) => edge.cursor != handleRequest.id
          );

        cache.writeQuery({
          query: GET_SENT_CONNECT_REQUESTS,
          variables: { first },
          data: {
            sentConnectRequests: {
              ...existingSentConnectRequests.sentConnectRequests,
              edges: newEdges,
              pageInfo: {
                ...existingSentConnectRequests.sentConnectRequests.pageInfo,
                startCursor: newEdges.length ? newEdges[0].cursor : null,
                endCursor: newEdges.length
                  ? newEdges[newEdges.length - 1].cursor
                  : null,
              },
            } as IModelConnection<IUser>,
          },
        });
      }

      const existingReceivedConnectRequests = cache.readQuery<{
        receivedConnectRequests: IModelConnection<IUser>;
      }>({
        query: GET_RECEIVED_CONNECT_REQUESTS,
        variables: { first },
      });

      if (existingReceivedConnectRequests) {
        const newEdges =
          existingReceivedConnectRequests.receivedConnectRequests.edges.filter(
            (edge) => edge.cursor != handleRequest.id
          );

        cache.writeQuery({
          query: GET_RECEIVED_CONNECT_REQUESTS,
          variables: { first },
          data: {
            receivedConnectRequests: {
              ...existingReceivedConnectRequests.receivedConnectRequests,
              edges: newEdges,
              pageInfo: {
                ...existingReceivedConnectRequests.receivedConnectRequests
                  .pageInfo,
                startCursor: newEdges.length ? newEdges[0].cursor : null,
                endCursor: newEdges.length
                  ? newEdges[newEdges.length - 1].cursor
                  : null,
              },
            } as IModelConnection<IUser>,
          },
        });
      }

      if (
        Object.values(handleRequest.relationships).includes(
          ContactRelationship.connected
        )
      ) {
        const existingContacts = cache.readQuery<{
          contacts: IModelConnection<IContact>;
        }>({
          query: GET_CONTACTS,
          variables: { first, after },
        });

        if (existingContacts) {
          cache.writeQuery({
            query: GET_CONTACTS,
            variables: { first, after },
            data: {
              contacts: {
                ...existingContacts.contacts,
                edges: [
                  ...existingContacts.contacts.edges,
                  {
                    __typename: "ContactEdge",
                    cursor: handleRequest.id,
                    node: handleRequest,
                  },
                ],
                pageInfo: {
                  ...existingContacts.contacts.pageInfo,
                  endCursor: handleRequest.id,
                },
              } as IModelConnection<IContact>,
            },
          });
        }
      } else {
        const existingConnectableUsers = cache.readQuery<{
          connectableUsers: IModelConnection<IUser>;
        }>({
          query: GET_CONNECTABLE_USERS,
          variables: { userId, first, after },
        });

        if (existingConnectableUsers) {
          const user = handleRequest.users.filter(
            (user) => user.id != userId
          )[0];

          if (
            existingConnectableUsers.connectableUsers.edges.some(
              (edge) => edge.cursor === user.id
            )
          )
            return;

          cache.writeQuery({
            query: GET_CONNECTABLE_USERS,
            variables: { userId, first, after },
            data: {
              connectableUsers: {
                ...existingConnectableUsers.connectableUsers,
                edges: [
                  ...existingConnectableUsers.connectableUsers.edges,
                  {
                    __typename: "UserEdge",
                    cursor: user.id,
                    node: user,
                  },
                ],
                pageInfo: {
                  ...existingConnectableUsers.connectableUsers.pageInfo,
                  endCursor: user.id,
                },
              } as IModelConnection<IUser>,
            },
          });
        }
      }
    },
  });
};

export const useRemoveConnect = ({
  first = 10,
  after,
}: {
  first?: number;
  after?: string;
}) => {
  return useMutation(REMOVE_CONNECT, {
    update(cache, { data }) {
      const removeConnect = data.removeConnect as IContact;

      const existing = cache.readQuery<{
        contacts: IModelConnection<IContact>;
      }>({
        query: GET_CONTACTS,
        variables: { first, after },
      });

      if (existing) {
        const newEdges = existing.contacts.edges.filter(
          (edge) => edge.cursor != removeConnect.id
        );

        cache.writeQuery({
          query: GET_CONTACTS,
          variables: { first, after },
          data: {
            contacts: {
              ...existing.contacts,
              edges: newEdges,
              pageInfo: {
                ...existing.contacts.pageInfo,
                startCursor: newEdges.length ? newEdges[0].cursor : null,
                endCursor: newEdges.length
                  ? newEdges[newEdges.length - 1].cursor
                  : null,
              },
            } as IModelConnection<IContact>,
          },
        });
      }
    },
  });
};
