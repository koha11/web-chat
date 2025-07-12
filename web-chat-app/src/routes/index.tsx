import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../components/ui/loading";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./privateRoute";
import Chat from "../pages/chat/Chat";
import MyApolloProvider from "../layouts/MyApolloProvider";
import OauthRoute from "./oauthRoute";

const Login = lazy(() => import("../pages/home/Login"));
const Home = lazy(() => import("../pages/home/Home"));
const Register = lazy(() => import("../pages/home/Register"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const Call = lazy(() => import("../pages/call/Call"));

const AccountLayout = lazy(() => import("../pages/account/Account"));
const GeneralInformation = lazy(
  () => import("../pages/account/GeneralInformation")
);

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
        path: "/login-success",
        element: <OauthRoute />,
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
            path: "/call",
            element: (
              <Suspense fallback={<Loading></Loading>}>
                <Call />
              </Suspense>
            ),
          },
          {
            path: "/me",
            element: <AccountLayout></AccountLayout>,
            children: [
              {
                index: true,
                path: "",
                element: (
                  <Suspense fallback={<Loading></Loading>}>
                    <GeneralInformation />
                  </Suspense>
                ),
              },
            ],
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
