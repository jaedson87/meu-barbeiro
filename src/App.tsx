import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import BookingForm from "./pages/BookingForm";
import Auth from "./pages/Auth";
import SuperAdminReal from "./pages/SuperAdminReal";
import TestNavigation from "./components/TestNavigation";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestNavigation />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="owner">
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/super-admin" element={
              <ProtectedRoute requiredRole="super_admin">
                <SuperAdminReal />
              </ProtectedRoute>
            } />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/book/:barbershopSlug" element={<BookingForm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
