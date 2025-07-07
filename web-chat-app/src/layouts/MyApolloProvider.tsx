import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { createWsClient, httpOnlyClient } from "../apollo";
import Cookies from "js-cookie";

const MyApolloProvider = () => {
  const location = useLocation();
  const userId = Cookies.get("userId");

  // Memoize client only when path matches "/m"
  const client = useMemo(() => {
    return location.pathname == "" ? httpOnlyClient : createWsClient();
  }, [userId]);

  return (
    <ApolloProvider client={client}>
      <Outlet></Outlet>
      <Toaster></Toaster>
    </ApolloProvider>
  );
};

export default MyApolloProvider;
