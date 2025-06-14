import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../components/ui/loading";
import ChatLayout from "../layouts/ChatLayout";

const Login = lazy(() => import("../pages/home/Login"));
const Home = lazy(() => import("../pages/home/Home"));
const Register = lazy(() => import("../pages/home/Register"));
const ChatIndex = lazy(() => import("../pages/chat/ChatIndex"));
const ChatDetails = lazy(() => import("../pages/chat/ChatDetails"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const Me = lazy(() => import("../pages/contact/Contact"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading></Loading>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading></Loading>}>
        <Login></Login>
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loading></Loading>}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={<Loading></Loading>}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: "/me",
    element: (
      <Suspense fallback={<Loading></Loading>}>
        <Me />
      </Suspense>
    ),
  },
  {
    element: <ChatLayout /> ,
    path: "/m",
    children: [
      {
        element: (
          <Suspense fallback={<Loading></Loading>}>
            <ChatIndex />
          </Suspense>
        ),
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={<Loading></Loading>}>
            <ChatDetails />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
