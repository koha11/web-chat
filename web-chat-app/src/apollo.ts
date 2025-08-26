import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookies from "js-cookie";

export const IS_DEV_ENV = import.meta.env.VITE_ENVIRONMENT == "DEV";
export const SERVER_HOST = IS_DEV_ENV
  ? "localhost"
  : import.meta.env.VITE_API_HOST;
export const SERVER_PORT = import.meta.env.VITE_API_PORT ?? "3000";
export const SERVER_URL = IS_DEV_ENV
  ? `http://${SERVER_HOST}:${SERVER_PORT}`
  : `https://${SERVER_HOST}`;

const httpLink = new HttpLink({
  uri: IS_DEV_ENV
    ? `http://${SERVER_HOST}:${SERVER_PORT}/graphql`
    : `https://${SERVER_HOST}/graphql`,
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
        ? `ws://${SERVER_HOST}:${SERVER_PORT}/subscriptions`
        : `wss://${SERVER_HOST}/subscriptions`,
      connectionParams: {
        authToken: token,
      },
      lazy: true, // only connect when needed
      retryAttempts: 5,
    })
  );

  const httpLink = createUploadLink({
    uri: IS_DEV_ENV
      ? `http://${SERVER_HOST}:${SERVER_PORT}/graphql`
      : `https://${SERVER_HOST}/graphql`,
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
