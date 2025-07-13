import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookies from "js-cookie";

const IS_DEV_ENV = import.meta.env.VITE_ENVIRONMENT == "DEV";
const HOST = IS_DEV_ENV ? "localhost" : import.meta.env.VITE_API_HOST;
const PORT = import.meta.env.VITE_API_PORT ?? "3000";

const httpLink = new HttpLink({
  uri: IS_DEV_ENV
    ? `http://${HOST}:${PORT}/graphql`
    : `https://${HOST}/graphql`,
});

export const httpOnlyClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const createWsClient = () => {
  const token = Cookies.get("accessToken");

  const wsLink = new GraphQLWsLink(
    createClient({
      url: IS_DEV_ENV
        ? `ws://${HOST}:${PORT}/subscriptions`
        : `wss://${HOST}/subscriptions`,
      connectionParams: {
        authToken: token,
      },
      lazy: true, // only connect when needed
      retryAttempts: 5,
    })
  );

  const httpLink = new HttpLink({
    uri: IS_DEV_ENV
      ? `http://${HOST}:${PORT}/graphql`
      : `https://${HOST}/graphql`,
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
