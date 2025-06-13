import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../components/ui/loading";
import ChatLayout from "../layouts/ChatLayout";


const router = createBrowserRouter([
  {
    element: ChatLayout(),
    children: [],
  },
]);

export default router;
