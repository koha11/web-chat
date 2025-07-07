import { RouterProvider, useLocation } from "react-router-dom";

import "./App.css";
import router from "./routes";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "./components/ui/sonner";
import { createWsClient, httpOnlyClient } from "./apollo";
import { useMemo } from "react";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
