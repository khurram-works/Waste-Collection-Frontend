import { useAuthNavigation } from "../hooks/useAuthNavigation";
import { useAuthContext } from "../context/authContext";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {

  const { user } = useAuthContext();
  const {login, unauthorized} = useAuthNavigation()

  useEffect(() => {
    if (!user) {
      login();
    } else if (!allowedRoles.includes(user.role)) {
      unauthorized();
    }
  }, [user, allowedRoles, login, unauthorized]);

  if (!user) return null;
  if (!allowedRoles.includes(user.role)) return null;
  return children;
}

export default ProtectedRoute;