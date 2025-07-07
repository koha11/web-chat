import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  DocumentNode,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
});

export const httpOnlyClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const createWsClient = () => {
  const token = Cookies.get("accessToken");

  const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://localhost:3000/subscriptions",
      connectionParams: {
        authToken: token,
      },
      lazy: true, // only connect when needed
      retryAttempts: 5,
    })
  );

  const httpLink = new HttpLink({
    uri: "http://localhost:3000/graphql",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Route subscription operations to wsLink, others to httpLink
  const splitLink = split(
    ({ query }) => {
      const def = getMainDefinition(query);

      return (
        def.kind === "OperationDefinition" && def.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
};
