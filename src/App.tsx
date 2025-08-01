
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Auth & Public Pages
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import Index from "@/pages/Index/index";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ActivityDetail from "@/pages/ActivityDetail";
import NotFound from "@/pages/NotFound";
import PartnerWithUs from "@/pages/Partner/PartnerWithUs";
import AboutPage from "@/pages/About/AboutPage";
import BlogPage from "@/pages/Blog/BlogPage";
import PartnerInfoPage from "@/pages/Partners/PartnerInfoPage";
import HowItWorksPage from "@/pages/HowItWorks/HowItWorksPage";

// Provider Pages
import ProviderDashboard from "@/pages/Provider/Dashboard";
import ActivityForm from "@/pages/Provider/ActivityForm";
import ExtracurricularActivityForm from "@/pages/Provider/ExtracurricularActivityForm";
import StudentsManagement from "@/pages/Provider/StudentsManagement";
import MessagesCenter from "@/pages/Provider/Messages";
import PaymentManagement from "@/pages/Provider/PaymentManagement";
import AttendanceTracking from "@/pages/Provider/AttendanceTracking";
import BillingManagement from "@/pages/Provider/BillingManagement";
import ProviderLayout from "@/pages/Provider/Layout";

// Admin Pages
import ProviderRequestsPage from "@/pages/Admin/ProviderRequestsPage";

// Route Protection
import ProviderRoute from "@/components/ProviderRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/partner-with-us" element={<PartnerWithUs />} />
            
            {/* New Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/partners" element={<PartnerInfoPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            
            {/* Provider Routes - Protected with ProviderRoute component */}
            <Route path="/provider" element={<ProviderRoute><ProviderLayout /></ProviderRoute>}>
              <Route index element={<ProviderDashboard />} />
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="activities/new" element={<ActivityForm />} />
              <Route path="activities/:id" element={<ActivityForm />} />
              <Route path="extracurricular/new" element={<ExtracurricularActivityForm />} />
              <Route path="extracurricular/:id" element={<ExtracurricularActivityForm />} />
              <Route path="students" element={<StudentsManagement />} />
              <Route path="messages" element={<MessagesCenter />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="attendance" element={<AttendanceTracking />} />
              <Route path="billing" element={<BillingManagement />} />
              <Route path="analytics" element={<ProviderDashboard />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/provider-requests" element={<ProviderRequestsPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
