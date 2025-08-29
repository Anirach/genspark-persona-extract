import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Navigation } from "./components/Navigation";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import StatsVerification from "./pages/StatsVerification";
import ReviewerAdmin from "./pages/ReviewerAdmin";
import SystemDashboard from "./pages/SystemDashboard";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/post/:id" element={<BlogPost />} />
          <Route path="/personaextraction" element={<Dashboard />} />
          <Route path="/stats" element={<StatsVerification />} />
          <Route path="/reviewer-admin" element={<ReviewerAdmin />} />
          <Route path="/system-dashboard" element={<SystemDashboard />} />
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
