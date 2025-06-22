import { RouterProvider } from "react-router-dom";

import "./App.css";
import router from "./routes";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
