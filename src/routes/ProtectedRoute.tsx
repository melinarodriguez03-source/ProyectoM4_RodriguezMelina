import { Navigate } from "react-router-dom";
import { useAuthContext } from "../features/auth/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="spinner" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export const PublicOnlyRoute = ({ children }: Props) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="spinner" />
      </div>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/tasks" replace />;
};