
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import Index from "@/pages/Index";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ActivityDetail from "@/pages/ActivityDetail";
import ProviderDashboard from "@/pages/Provider/Dashboard";
import ActivityForm from "@/pages/Provider/ActivityForm";
import NotFound from "@/pages/NotFound";

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
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/activities/new" element={<ActivityForm />} />
            <Route path="/provider/activities/:id" element={<ActivityForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
