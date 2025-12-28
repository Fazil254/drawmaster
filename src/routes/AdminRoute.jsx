import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {

  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
