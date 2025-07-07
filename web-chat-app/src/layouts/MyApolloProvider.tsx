import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { createWsClient, httpOnlyClient } from "../apollo";

const MyApolloProvider = () => {
  const location = useLocation();

  // Memoize client only when path matches "/m"
  const client = useMemo(() => {
    return location.pathname.startsWith("/m")
      ? createWsClient()
      : httpOnlyClient;
  }, [location.pathname]);

  return (
    <ApolloProvider client={client}>
      <Outlet></Outlet>
      <Toaster></Toaster>
    </ApolloProvider>
  );
};

export default MyApolloProvider;
