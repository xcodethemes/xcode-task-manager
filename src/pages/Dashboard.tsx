
import React from 'react';
import { useTaskContext, Status } from '@/contexts/TaskContext';
import { ProjectCard } from '@/components/ui-custom/ProjectCard';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { ProgressBar } from '@/components/ui-custom/ProgressBar';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { 
  Check, 
  Clock, 
  FileText, 
  PieChart, 
  Plus, 
  UserPlus 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { 
    tasks, 
    projects, 
    employees, 
    isLoading,
    currentUser,
    isAdmin,
    getTasksByEmployee,
    getProjectsByEmployee
  } = useTaskContext();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <PieChart className="h-12 w-12 mx-auto text-primary opacity-50" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Get filtered tasks and projects based on role
  const filteredTasks = isAdmin() ? tasks : (currentUser ? getTasksByEmployee(currentUser.id) : []);
  const filteredProjects = isAdmin() ? projects : (currentUser ? getProjectsByEmployee(currentUser.id) : []);

  const totalProjects = filteredProjects.length;
  const completedProjects = filteredProjects.filter(p => p.status === 'done').length;
  const inProgressProjects = filteredProjects.filter(p => p.status === 'in-progress').length;

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = filteredTasks.filter(t => t.status === 'todo').length;
  const reviewTasks = filteredTasks.filter(t => t.status === 'review').length;

  const now = new Date();
  const in7Days = new Date();
  in7Days.setDate(now.getDate() + 7);
  
  const dueSoonTasks = filteredTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate > now && dueDate <= in7Days && task.status !== 'done';
  });

  const recentProjects = [...filteredProjects]
    .filter(p => p.status !== 'done')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  const statusDistribution: Record<Status, number> = {
    'todo': todoTasks,
    'in-progress': inProgressTasks,
    'review': reviewTasks,
    'done': completedTasks
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser?.name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's an overview of your {isAdmin() ? "team's" : ""} work.</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button onClick={() => navigate('/tasks/new')}>
            <Plus className="h-4 w-4 mr-2" /> New Task
          </Button>
          <Button variant="outline" onClick={() => navigate('/projects/new')}>
            <FileText className="h-4 w-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card animate-slide-up [animation-delay:100ms]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{completedTasks} completed</p>
            <ProgressBar value={completedTasks} max={totalTasks || 1} className="mt-2" size="sm" />
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-slide-up [animation-delay:200ms]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">{inProgressProjects} in progress</p>
            <ProgressBar 
              value={completedProjects} 
              max={totalProjects || 1} 
              className="mt-2" 
              size="sm" 
              color="success" 
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-slide-up [animation-delay:300ms]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <div className="flex items-center mt-2">
              {isAdmin() && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => navigate('/team/new')}
                >
                  <UserPlus className="h-3 w-3 mr-1" /> Add Member
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-slide-up [animation-delay:400ms]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueSoonTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks due in 7 days</p>
            <div className="flex items-center mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => navigate('/due-soon')}
              >
                <Clock className="h-3 w-3 mr-1" /> View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2 animate-scale-in">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest active projects and their progress
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                tasks={filteredTasks.filter(t => t.projectId === project.id)}
                employees={employees}
                onClick={() => navigate(`/projects/${project.id}`)}
              />
            ))}
            {recentProjects.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-6 text-center">
                <FileText className="h-10 w-10 text-muted-foreground opacity-40" />
                <p className="mt-2 text-muted-foreground">No active projects found</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/projects/new')}>
                  <Plus className="h-4 w-4 mr-2" /> Create Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card animate-scale-in [animation-delay:100ms]">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>
              Current distribution of tasks by status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <div key={status} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <StatusBadge status={status as Status} />
                  <span className="font-medium">{count}</span>
                </div>
                <ProgressBar 
                  value={count} 
                  max={totalTasks || 1} 
                  showLabel={false} 
                  size="sm" 
                  color={status === 'done' ? 'success' : 'default'} 
                />
              </div>
            ))}
            
            <div className="pt-4 mt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
              </div>
              <ProgressBar value={completedTasks} max={totalTasks || 1} showLabel={false} color="success" />
              
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/tasks')}>
                <Check className="h-4 w-4 mr-2" /> View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="glass-card animate-scale-in [animation-delay:200ms]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>
                  Your most recent assigned tasks
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => navigate('/tasks')}>View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTasks
                .filter(t => t.status !== 'done')
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 8)
                .map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  const assignee = employees.find(e => e.id === task.assigneeId);
                  
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      assignee={assignee}
                      projectName={project?.name || 'Unknown Project'}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    />
                  );
                })}
              {filteredTasks.filter(t => t.status !== 'done').length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <Check className="h-12 w-12 text-status-done opacity-40" />
                  <p className="mt-2 text-muted-foreground">All caught up! No pending tasks.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/tasks/new')}>
                    <Plus className="h-4 w-4 mr-2" /> Create Task
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
