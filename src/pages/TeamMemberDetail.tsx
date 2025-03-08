
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { ProjectCard } from '@/components/ui-custom/ProjectCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  Loader2, 
  Mail, 
  User, 
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const TeamMemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, tasks, projects, isLoading } = useTaskContext();
  
  // Find the employee
  const employee = employees.find(emp => emp.id === id);
  
  // Get employee's tasks
  const employeeTasks = tasks.filter(task => task.assigneeId === id);
  const activeTasks = employeeTasks.filter(task => task.status !== 'done');
  const completedTasks = employeeTasks.filter(task => task.status === 'done');
  
  // Get employee's projects
  const employeeProjects = projects.filter(project => project.teamIds.includes(id || ''));
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading employee details...</p>
        </div>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="text-center py-20">
        <User className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
        <h2 className="text-2xl font-bold mt-4">Team Member Not Found</h2>
        <p className="text-muted-foreground mt-2">The team member you're looking for doesn't exist</p>
        <Button className="mt-6" onClick={() => navigate('/team')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Team
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/team')}
        className="-ml-3"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Team
      </Button>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Employee Details Card */}
        <Card className="glass-card w-full md:w-1/3">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{employee.name}</CardTitle>
              <Badge variant="secondary" className="mt-2">
                {employee.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>Projects: {employeeProjects.length}</span>
              </div>
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>Tasks: {employeeTasks.length}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>Active Tasks: {activeTasks.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tasks and Projects Tabs */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks" className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" /> Tasks
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" /> Projects
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="space-y-4">
              {activeTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        assignee={employee}
                        projectName={project?.name || 'Unknown Project'}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <CheckSquare className="h-10 w-10 mx-auto text-muted-foreground opacity-40" />
                  <h3 className="text-lg font-medium mt-4">No Active Tasks</h3>
                  <p className="text-muted-foreground mt-2">
                    This team member doesn't have any active tasks assigned
                  </p>
                </Card>
              )}
              
              {completedTasks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Completed Tasks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedTasks.slice(0, 4).map(task => {
                      const project = projects.find(p => p.id === task.projectId);
                      return (
                        <TaskCard
                          key={task.id}
                          task={task}
                          assignee={employee}
                          projectName={project?.name || 'Unknown Project'}
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        />
                      );
                    })}
                  </div>
                  
                  {completedTasks.length > 4 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => navigate(`/tasks?assignee=${employee.id}&status=done`)}
                    >
                      View All Completed Tasks
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              {employeeProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employeeProjects.map(project => {
                    const projectTasks = tasks.filter(t => t.projectId === project.id);
                    return (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        tasks={projectTasks}
                        employees={employees}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      />
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <Briefcase className="h-10 w-10 mx-auto text-muted-foreground opacity-40" />
                  <h3 className="text-lg font-medium mt-4">No Projects</h3>
                  <p className="text-muted-foreground mt-2">
                    This team member isn't assigned to any projects yet
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetail;
