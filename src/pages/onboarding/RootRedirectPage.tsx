import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.hooks";

export function RootRedirectPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-dasiwa-bg px-5">
        <p className="text-sm font-medium text-dasiwa-muted">다시와를 준비하고 있어요.</p>
      </main>
    );
  }

  return <Navigate to="/splash" replace />;
}
