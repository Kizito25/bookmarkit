import { Toaster } from "sonner";
import { ThemeProvider } from "./contexts/theme-provider";
import { AuthProvider } from "./contexts/auth-provider";
import { AdminAuthProvider } from "./contexts/admin-auth-provider";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLoginPage } from "./pages/AuthLogin";
import { AuthSignupPage } from "./pages/AuthSignup";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./pages/protected-route";
import { useAuth } from "./contexts/auth-provider";
import { BookmarksProvider } from "./contexts/bookmarks-provider";
import { ProfileProvider } from "./contexts/profile-provider";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { LoadingScreen } from "./components/LoadingScreen";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminProtectedRoute } from "./pages/admin/AdminProtectedRoute";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { UsersPage } from "./pages/admin/Users";
import { UserDetailPage } from "./pages/admin/UserDetail";
import { BillingPage } from "./pages/admin/Billing";
import { CollectionsPage } from "./pages/admin/Collections";
import { AnalyticsPage } from "./pages/admin/Analytics";
import { AdminSettingsPage } from "./pages/admin/Settings";
import { RolesPage } from "./pages/admin/Roles";
import { AuditLogsPage } from "./pages/admin/AuditLogs";
import { AdminDataRequestsPage } from "./pages/admin/DataRequests";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";
import { TermsOfUsePage } from "./pages/TermsOfUse";
// wherever your routes are defined
import { AuthCallback } from "@/pages/AuthCallback";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <Routes>
                <Route path="login" element={<AdminLogin />} />
                <Route
                  element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="users/:id" element={<UserDetailPage />} />
                  <Route path="billing" element={<BillingPage />} />
                  <Route path="collections" element={<CollectionsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="roles" element={<RolesPage />} />
                  <Route path="audit" element={<AuditLogsPage />} />
                  <Route path="data-requests" element={<AdminDataRequestsPage />} />
                </Route>
              </Routes>
            </AdminAuthProvider>
          }
        />

        {/* Main App Routes */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <AppRoutes />
              <PWAInstallPrompt />
            </AuthProvider>
          }
        />
      </Routes>
      <Toaster richColors />
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={!session ? <Landing /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/login"
        element={
          !session ? <AuthLoginPage /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/signup"
        element={
          !session ? <AuthSignupPage /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/auth/login"
        element={
          !session ? <AuthLoginPage /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/auth/signup"
        element={
          !session ? <AuthSignupPage /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <ProfileProvider>
              <BookmarksProvider>
                <Dashboard />
              </BookmarksProvider>
            </ProfileProvider>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={session ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;
