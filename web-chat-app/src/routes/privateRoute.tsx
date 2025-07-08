import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const token = Cookies.get("accessToken");

  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRoute;
