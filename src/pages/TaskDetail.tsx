
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext, Priority, Status } from '@/contexts/TaskContext';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { PriorityBadge } from '@/components/ui-custom/PriorityBadge';
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
  CheckCircle, 
  Folder, 
  Loader2, 
  Save, 
  User 
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tasks, projects, employees, isLoading, updateTask, isAdmin } = useTaskContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(tasks.find(t => t.id === id));
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo' as Status,
    priority: task?.priority || 'medium' as Priority,
    assigneeId: task?.assigneeId || '',
    dueDate: task?.dueDate || '',
  });
  
  const project = projects.find(p => p.id === task?.projectId);
  const assignee = employees.find(e => e.id === task?.assigneeId);
  
  useEffect(() => {
    // Update the task when tasks change (e.g., after saving)
    const updatedTask = tasks.find(t => t.id === id);
    setTask(updatedTask);
    if (updatedTask) {
      setFormData({
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        assigneeId: updatedTask.assigneeId,
        dueDate: updatedTask.dueDate,
      });
    }
  }, [tasks, id]);
  
  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading task details...</p>
        </div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Task not found</h2>
          <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/tasks')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tasks
          </Button>
        </div>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    const updatedTask = {
      ...task,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assigneeId: formData.assigneeId,
      dueDate: formData.dueDate,
      completedAt: formData.status === 'done' && task.status !== 'done' 
        ? new Date().toISOString() 
        : task.completedAt,
    };
    
    updateTask(updatedTask);
    setIsEditing(false);
    toast({
      title: "Task updated",
      description: "The task has been successfully updated.",
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/tasks')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tasks
        </Button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Task' : task.title}
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
                <Button onClick={() => setIsEditing(true)}>
                  Edit Task
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Card className="glass-card">
        {isEditing ? (
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Task description"
                  className="min-h-32"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={handleSelectChange('status')}
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
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={handleSelectChange('priority')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Assignee</label>
                  <Select 
                    value={formData.assigneeId} 
                    onValueChange={handleSelectChange('assigneeId')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Due Date</label>
                  <Input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate.split('T')[0]}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <StatusBadge status={task.status} />
                    <div className="mx-2">•</div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <CardTitle className="text-2xl">{task.title}</CardTitle>
                  {project && (
                    <CardDescription className="flex items-center mt-2">
                      <Folder className="h-4 w-4 mr-1" /> {project.name}
                    </CardDescription>
                  )}
                </div>
                
                {task.completedAt && (
                  <div className="flex items-center text-status-done">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm">
                      Completed on {formatDate(task.completedAt)}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <h3 className="text-lg font-medium mb-3">Description</h3>
                  <div className="prose max-w-none">
                    {task.description ? (
                      <p className="whitespace-pre-line">{task.description}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No description provided</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Assignee</h3>
                    {assignee ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={assignee.avatar} />
                          <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                        </Avatar>
                        <span>{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Created</h3>
                    <div className="text-sm">
                      {formatDate(task.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}
        
        <CardFooter className="border-t p-6">
          <div className="w-full flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate('/tasks')}
            >
              Back to Tasks
            </Button>
            
            {isEditing && (
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaskDetail;
