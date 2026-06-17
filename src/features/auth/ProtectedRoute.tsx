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
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="rounded-lg border border-stone-200 bg-white px-5 py-4 text-center shadow-sm">
          <p className="text-sm font-medium text-stone-900">인증 상태 확인 중</p>
          <p className="mt-1 text-sm text-stone-500">잠시만 기다려주세요.</p>
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
