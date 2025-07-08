import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const OauthRoute = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get("accessToken");
  const userId = queryParams.get("userId");

  if (!accessToken || !userId) {
    return <Navigate to="/login" replace={true} />;
  }

  Cookies.set("accessToken", accessToken);
  Cookies.set("userId", userId);

  return <Navigate to="/m" replace={true} />;
};

export default OauthRoute;
