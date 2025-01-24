import { Navigate, Outlet, useLocation } from "react-router";

import { usePocketbase } from "@/lib/context/PocketbaseContext";

export const RequireAuth = () => {
  const { user } = usePocketbase();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={{ pathname: "/sign-in" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
