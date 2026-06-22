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
import { OnboardingPage } from "../pages/onboarding/OnboardingPage";
import { RootRedirectPage } from "../pages/onboarding/RootRedirectPage";
import { SplashPage } from "../pages/onboarding/SplashPage";
import { SettingsPage } from "../pages/settings/SettingsPage";

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirectPage /> },
  { path: "/splash", element: <SplashPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/app",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "customers", element: <CustomerListPage /> },
      { path: "customers/new", element: <CustomerNewPage /> },
      { path: "customers/:customerId", element: <CustomerDetailPage /> },
      { path: "follow-ups", element: <FollowUpsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
