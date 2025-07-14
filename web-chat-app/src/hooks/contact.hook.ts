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
import { GET_SENT_CONNECT_REQUESTS } from "@/services/userService";
import { IUser } from "@/interfaces/user.interface";
import Cookies from "js-cookie";

export const useGetContacts = ({
  after,
  first = 10,
}: {
  first?: number;
  after?: string;
}): IMyQueryResult<IModelConnection<IContact>> => {
  const myQuery = useQuery(GET_CONTACTS, {
    variables: { first, after },
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

export const useHandleRequest = ({ first = 10 }: { first?: number }) => {
  return useMutation(HANDLE_REQUEST, {
    update(cache, { data }) {
      const handleRequest = data.handleRequest as IContact;

      const existing = cache.readQuery<{
        sentConnectRequests: IModelConnection<IUser>;
      }>({
        query: GET_SENT_CONNECT_REQUESTS,
        variables: { first },
      });

      if (existing) {
        const newEdges = existing.sentConnectRequests.edges.filter(
          (edge) => edge.cursor != handleRequest.id
        );

        cache.writeQuery({
          query: GET_SENT_CONNECT_REQUESTS,
          variables: { first },
          data: {
            sentConnectRequests: {
              ...existing.sentConnectRequests,
              edges: newEdges,
              pageInfo: {
                ...existing.sentConnectRequests.pageInfo,
                startCursor: newEdges.length ? newEdges[0].cursor : null,
                endCursor: newEdges.length
                  ? newEdges[newEdges.length - 1].cursor
                  : null,
              },
            } as IModelConnection<IUser>,
          },
        });
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
