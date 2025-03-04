
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import Index from "@/pages/Index/index";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ActivityDetail from "@/pages/ActivityDetail";
import ProviderDashboard from "@/pages/Provider/Dashboard";
import ActivityForm from "@/pages/Provider/ActivityForm";
import ExtracurricularActivityForm from "@/pages/Provider/ExtracurricularActivityForm";
import StudentsManagement from "@/pages/Provider/StudentsManagement";
import MessagesCenter from "@/pages/Provider/MessagesCenter";
import PaymentManagement from "@/pages/Provider/PaymentManagement";
import NotFound from "@/pages/NotFound";
import ProviderRoute from "@/components/ProviderRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            
            {/* Provider Routes - Protected with ProviderRoute component */}
            <Route path="/provider" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />
            <Route path="/provider/dashboard" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />
            <Route path="/provider/activities/new" element={<ProviderRoute><ActivityForm /></ProviderRoute>} />
            <Route path="/provider/activities/:id" element={<ProviderRoute><ActivityForm /></ProviderRoute>} />
            <Route path="/provider/extracurricular/new" element={<ProviderRoute><ExtracurricularActivityForm /></ProviderRoute>} />
            <Route path="/provider/extracurricular/:id" element={<ProviderRoute><ExtracurricularActivityForm /></ProviderRoute>} />
            <Route path="/provider/students" element={<ProviderRoute><StudentsManagement /></ProviderRoute>} />
            <Route path="/provider/messages" element={<ProviderRoute><MessagesCenter /></ProviderRoute>} />
            <Route path="/provider/payments" element={<ProviderRoute><PaymentManagement /></ProviderRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
