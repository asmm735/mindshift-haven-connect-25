
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";

// Pages
import Index from "./pages/Index";
import MoodTracker from "./pages/MoodTracker";
import AIChat from "./pages/AIChat";
import Pomodoro from "./pages/Pomodoro";
import TheraConnect from "./pages/TheraConnect";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mood-tracker" element={
            <RequireAuth>
              <MoodTracker />
            </RequireAuth>
          } />
          <Route path="/ai-chat" element={
            <RequireAuth>
              <AIChat />
            </RequireAuth>
          } />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/therapists" element={<TheraConnect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
