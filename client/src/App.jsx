import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute, { AdminRoute } from './components/routes/Guards';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import InformationHubPage from './pages/InformationHubPage';
import InformationDetailPage from './pages/InformationDetailPage';
import FaqPage from './pages/FaqPage';
import SourcesPage from './pages/SourcesPage';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public marketing pages */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/information" element={<InformationHubPage />} />
                <Route path="/information/:slug" element={<InformationDetailPage />} />
                <Route path="/faqs" element={<FaqPage />} />
                <Route path="/sources" element={<SourcesPage />} />
              </Route>

              {/* Authenticated user portal */}
              <Route path="/app" element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="information" element={<InformationHubPage />} />
                  <Route path="information/:slug" element={<InformationDetailPage />} />
                  <Route path="faqs" element={<FaqPage />} />
                  <Route path="sources" element={<SourcesPage />} />
                  <Route path="saved" element={<div className="p-8"><h1 className="text-2xl font-bold">Saved Information</h1><p className="mt-2 text-muted">Your bookmarks and saved articles.</p></div>} />
                  <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Citizen Profile</h1><p className="mt-2 text-muted">Manage your language preferences and account settings.</p></div>} />
                </Route>
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
