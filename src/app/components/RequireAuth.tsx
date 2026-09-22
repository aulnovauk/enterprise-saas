import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../lib/auth";

/**
 * Gate for every authenticated route. Unauthenticated visitors are sent to
 * /login, remembering where they were headed so sign-in can return them there.
 */
export function RequireAuth() {
  const { isAuthenticated } = useSession();
  const location = useLocation();

  if (!isAuthenticated) {
    const from = location.pathname + location.search;
    return <Navigate to="/login" replace state={{ from: from === "/login" ? "/" : from }} />;
  }

  return <Outlet />;
}
