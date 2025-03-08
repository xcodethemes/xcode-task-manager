
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext, Status } from '@/contexts/TaskContext';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { ProgressBar } from '@/components/ui-custom/ProgressBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Calendar, 
  Loader2, 
  Plus, 
  Save, 
  Users 
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    projects, 
    tasks, 
    employees, 
    isLoading, 
    updateProject, 
    getTasksByProject,
    isAdmin 
  } = useTaskContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState(projects.find(p => p.id === id));
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'todo' as Status,
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    teamIds: project?.teamIds || [],
  });
  
  // Get project tasks based on user role
  const projectTasks = id ? getTasksByProject(id) : [];
  
  useEffect(() => {
    // Update the project when projects change (e.g., after saving)
    const updatedProject = projects.find(p => p.id === id);
    setProject(updatedProject);
    if (updatedProject) {
      setFormData({
        name: updatedProject.name,
        description: updatedProject.description,
        status: updatedProject.status,
        startDate: updatedProject.startDate,
        endDate: updatedProject.endDate,
        teamIds: updatedProject.teamIds,
      });
    }
  }, [projects, id]);
  
  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
          </Button>
        </div>
      </div>
    );
  }
  
  const teamMembers = employees.filter(emp => project.teamIds.includes(emp.id));
  
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(t => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as Status }));
  };
  
  const handleTeamChange = (empId: string) => {
    setFormData(prev => {
      const teamIds = prev.teamIds.includes(empId)
        ? prev.teamIds.filter(id => id !== empId)
        : [...prev.teamIds, empId];
      return { ...prev, teamIds };
    });
  };
  
  const handleSave = () => {
    const updatedProject = {
      ...project,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate,
      teamIds: formData.teamIds,
    };
    
    updateProject(updatedProject);
    setIsEditing(false);
    toast({
      title: "Project updated",
      description: "The project has been successfully updated.",
    });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/projects')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
        </Button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Project' : project.name}
          </h1>
          
          {isAdmin() && (
            <div>
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => navigate(`/tasks/new?projectId=${project.id}`)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Project
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card mb-6">
            {isEditing ? (
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Project Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Project name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Project description"
                      className="min-h-32"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <Select 
                        value={formData.status} 
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Start Date</label>
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate.split('T')[0]}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">End Date</label>
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate.split('T')[0]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Team Members</label>
                    <div className="border rounded-md p-4 mt-2 max-h-60 overflow-y-auto space-y-2">
                      {employees.map(employee => (
                        <div key={employee.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`emp-${employee.id}`}
                            checked={formData.teamIds.includes(employee.id)}
                            onChange={() => handleTeamChange(employee.id)}
                            className="mr-2"
                          />
                          <label htmlFor={`emp-${employee.id}`} className="flex items-center cursor-pointer">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                            </Avatar>
                            {employee.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <StatusBadge status={project.status} className="mb-2" />
                      <CardTitle className="text-2xl">{project.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Description</h3>
                      <div className="prose max-w-none">
                        {project.description ? (
                          <p className="whitespace-pre-line">{project.description}</p>
                        ) : (
                          <p className="text-muted-foreground italic">No description provided</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Start Date</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(project.startDate)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">End Date</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(project.endDate)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Progress</h3>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{completedTasks} of {totalTasks} tasks completed</span>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <ProgressBar value={completedTasks} max={totalTasks || 1} color="success" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
            
            {isEditing && (
              <CardFooter className="border-t p-6">
                <div className="w-full flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tasks</CardTitle>
                {isAdmin() && (
                  <Button variant="outline" size="sm" onClick={() => navigate(`/tasks/new?projectId=${project.id}`)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                )}
              </div>
              <CardDescription>
                Tasks associated with this project
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {projectTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {projectTasks.map(task => {
                    const assignee = employees.find(e => e.id === task.assigneeId);
                    
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        assignee={assignee}
                        projectName={project.name}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground mb-4">No tasks have been added to this project yet.</p>
                  {isAdmin() && (
                    <Button onClick={() => navigate(`/tasks/new?projectId=${project.id}`)}>
                      <Plus className="h-4 w-4 mr-2" /> Create First Task
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="glass-card sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2" /> Team ({teamMembers.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {teamMembers.length > 0 ? (
                <div className="space-y-4">
                  {teamMembers.map(member => (
                    <div key={member.id} className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground">No team members assigned</p>
                </div>
              )}
              
              {isAdmin() && !isEditing && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setIsEditing(true)}
                >
                  Manage Team
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
