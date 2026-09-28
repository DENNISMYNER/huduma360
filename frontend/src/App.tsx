import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { CatalogProvider } from "./context/CatalogContext";
import { SavedProvider } from "./context/SavedContext";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import RequireAuth from "./components/common/RequireAuth";
import RequireAdmin from "./components/common/RequireAdmin";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CategoryPage from "./pages/CategoryPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import SavedPage from "./pages/SavedPage";
import RecentPage from "./pages/RecentPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <CatalogProvider>
              <SavedProvider>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="categories/:slug" element={<CategoryPage />} />
                    <Route path="services/:slug" element={<ServiceDetailPage />} />
                    <Route path="search" element={<SearchResultsPage />} />
                    <Route
                      path="applications"
                      element={
                        <RequireAuth>
                          <ApplicationsPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="saved"
                      element={
                        <RequireAuth>
                          <SavedPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="recent"
                      element={
                        <RequireAuth>
                          <RecentPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="profile"
                      element={
                        <RequireAuth>
                          <ProfilePage />
                        </RequireAuth>
                      }
                    />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  <Route
                    path="admin"
                    element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }
                  >
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="applications" element={<AdminApplicationsPage />} />
                    <Route path="payments" element={<AdminPaymentsPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                  </Route>
                </Routes>
              </SavedProvider>
            </CatalogProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
