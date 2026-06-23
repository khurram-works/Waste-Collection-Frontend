import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const storedUser = localStorage.getItem("user");
  
  if (storedUser) {
    const user = JSON.parse(storedUser);
    const rolePaths: Record<string, string> = {
      CITIZEN: "/citizen",
      WORKER: "/worker",
      ADMIN: "/admin",
    };
    return <Navigate to={rolePaths[user.role] || "/"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
