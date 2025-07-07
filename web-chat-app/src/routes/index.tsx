import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Loading from "../components/ui/loading";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./privateRoute";
import Chat from "../pages/chat/Chat";
import { ApolloProvider } from "@apollo/client";
import MyApolloProvider from "../layouts/MyApolloProvider";

const Login = lazy(() => import("../pages/home/Login"));
const Home = lazy(() => import("../pages/home/Home"));
const Register = lazy(() => import("../pages/home/Register"));
const ChatIndex = lazy(() => import("../pages/chat/ChatIndex"));
const ChatDetails = lazy(() => import("../pages/chat/ChatDetails"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const Me = lazy(() => import("../pages/contact/Contact"));

const router = createBrowserRouter([
  {
    element: <MyApolloProvider />,
    children: [
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
        element: <PrivateRoute />,
        children: [
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
            element: <MainLayout />,
            children: [
              {
                path: "/m",
                element: (
                  <Suspense fallback={<Loading></Loading>}>
                    <Chat />
                  </Suspense>
                ),
              },
              {
                path: "/m/:id",
                element: (
                  <Suspense fallback={<Loading></Loading>}>
                    <Chat />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
