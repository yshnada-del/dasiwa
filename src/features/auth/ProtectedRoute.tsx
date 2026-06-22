import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth.hooks";

type ProtectedRouteProps = PropsWithChildren<{
  requireAuth?: boolean;
}>;

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dasiwa-bg px-4">
        <div className="rounded-3xl border border-dasiwa-border bg-white px-5 py-4 text-center shadow-sm">
          <p className="text-sm font-semibold text-dasiwa-text">확인 중이에요</p>
          <p className="mt-1 text-sm text-dasiwa-muted">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}
