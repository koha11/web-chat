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
const Security = lazy(() => import("@/pages/account/Security"));
const VerifyEmail = lazy(() => import("@/pages/home/VerifyEmail"));

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
        path: "/verify-email",
        element: (
          <Suspense fallback={<Loading></Loading>}>
            <VerifyEmail />
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
            element: <AccountLayout></AccountLayout>,
            children: [
              {
                path: "/me",
                element: (
                  <Suspense fallback={<Loading></Loading>}>
                    <GeneralInformation />
                  </Suspense>
                ),
              },
              {
                path: "/me/security",
                element: (
                  <Suspense fallback={<Loading></Loading>}>
                    <Security />
                  </Suspense>
                ),
              },
              {
                path: "/me/settings",
                element: (
                  <Suspense fallback={<Loading></Loading>}>
                    <Security />
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
                path: "/m/new",
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
