
import { Navigate, Outlet, replace } from "react-router-dom";

const PrivateRoute = () => {
  // const { data: user, isLoading, error } = useGetProfile();
  // if (isLoading) {
  //   return <Loading />;
  // }

  // if (!user || error) {
  //   return <Navigate to="/auth/login" replace={true} />;
  // }

  return Outlet;
};

export default PrivateRoute;
