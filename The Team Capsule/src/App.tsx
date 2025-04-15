import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import LeaveRequests from "./pages/LeaveRequests";
import ManageRequests from "./pages/ManageRequests";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

type ProtectedRouteProps = {
  element: React.ReactNode;
  requiresManager?: boolean;
};

const ProtectedRoute = ({ element, requiresManager = false }: ProtectedRouteProps) => {
  const { currentUser, isManager } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiresManager && !isManager) {
    return <Navigate to="/" />;
  }
  
  return (
    <>
      <Navbar />
      {element}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner closeButton position="bottom-right" duration={3000} />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute element={<Index />} />} />
              <Route path="/leave-requests" element={<ProtectedRoute element={<LeaveRequests />} />} />
              <Route path="/manage-requests" element={<ProtectedRoute element={<ManageRequests />} requiresManager={true} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} />} />
              <Route path="/resources" element={<ProtectedRoute element={<Resources />} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
