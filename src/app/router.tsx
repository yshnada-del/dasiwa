import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { CustomerDetailPage } from "../pages/customers/CustomerDetailPage";
import { CustomerListPage } from "../pages/customers/CustomerListPage";
import { CustomerNewPage } from "../pages/customers/CustomerNewPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { FollowUpsPage } from "../pages/follow-ups/FollowUpsPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectedRoute requireAuth={false}>
        <SignupPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "customers",
        element: <CustomerListPage />,
      },
      {
        path: "customers/new",
        element: <CustomerNewPage />,
      },
      {
        path: "customers/:customerId",
        element: <CustomerDetailPage />,
      },
      {
        path: "follow-ups",
        element: <FollowUpsPage />,
      },
    ],
  },
]);
