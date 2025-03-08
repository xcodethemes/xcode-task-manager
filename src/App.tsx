
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskProvider, useTaskContext } from "@/contexts/TaskContext";
import TaskLayout from "@/components/layout/TaskLayout";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import TaskDetail from "@/pages/TaskDetail";
import NewTask from "@/pages/NewTask";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import NewProject from "@/pages/NewProject";
import Team from "@/pages/Team";
import NewTeamMember from "@/pages/NewTeamMember";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";

const queryClient = new QueryClient();

// Protected route component to check if user is logged in
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useTaskContext();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component that only allows admins
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAdmin } = useTaskContext();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Main App component that provides global context but not routing
const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TaskProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TaskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Routes component that uses context
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <TaskLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="tasks/new" element={<NewTask />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/new" element={<NewProject />} />
          <Route path="team" element={<Team />} />
          <Route path="team/new" element={
            <AdminRoute>
              <NewTeamMember />
            </AdminRoute>
          } />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppWithProviders;
