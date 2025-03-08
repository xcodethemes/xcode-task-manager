
import { Task, Project, Employee, Status, Priority } from '@/contexts/TaskContext';

// Mock employees data
export const mockEmployees: Employee[] = [
  {
    id: 'emp1',
    name: 'Alex Johnson',
    role: 'Frontend Developer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'alex.johnson@example.com',
  },
  {
    id: 'emp2',
    name: 'Samantha Lee',
    role: 'UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'samantha.lee@example.com',
  },
  {
    id: 'emp3',
    name: 'Michael Chen',
    role: 'Backend Developer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    email: 'michael.chen@example.com',
  },
  {
    id: 'emp4',
    name: 'Emily Rodriguez',
    role: 'Project Manager',
    avatar: 'https://i.pravatar.cc/150?img=4',
    email: 'emily.rodriguez@example.com',
  },
  {
    id: 'emp5',
    name: 'David Kim',
    role: 'DevOps Engineer',
    avatar: 'https://i.pravatar.cc/150?img=8',
    email: 'david.kim@example.com',
  },
  {
    id: 'emp6',
    name: 'Sophie Taylor',
    role: 'QA Engineer',
    avatar: 'https://i.pravatar.cc/150?img=9',
    email: 'sophie.taylor@example.com',
  },
];

// Mock projects data
export const mockProjects: Project[] = [
  {
    id: 'proj1',
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles',
    startDate: '2023-10-01',
    endDate: '2023-12-15',
    status: 'in-progress',
    teamIds: ['emp1', 'emp2', 'emp4'],
  },
  {
    id: 'proj2',
    name: 'Mobile App Development',
    description: 'Create a new mobile app for client inventory management',
    startDate: '2023-09-15',
    endDate: '2024-01-30',
    status: 'in-progress',
    teamIds: ['emp1', 'emp3', 'emp4', 'emp6'],
  },
  {
    id: 'proj3',
    name: 'API Optimization',
    description: 'Improve API performance and add new endpoints',
    startDate: '2023-11-01',
    endDate: '2024-02-15',
    status: 'todo',
    teamIds: ['emp3', 'emp5'],
  },
  {
    id: 'proj4',
    name: 'DevOps Infrastructure',
    description: 'Set up CI/CD pipeline and cloud infrastructure',
    startDate: '2023-08-01',
    endDate: '2023-11-30',
    status: 'done',
    teamIds: ['emp5', 'emp3'],
  },
  {
    id: 'proj5',
    name: 'Analytics Dashboard',
    description: 'Create a new analytics dashboard with data visualization',
    startDate: '2023-12-01',
    endDate: '2024-03-15',
    status: 'todo',
    teamIds: ['emp1', 'emp2', 'emp4'],
  },
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Design Homepage Mockup',
    description: 'Create wireframes and mockups for the new homepage design',
    status: 'done',
    priority: 'high',
    projectId: 'proj1',
    assigneeId: 'emp2',
    dueDate: '2023-10-15',
    createdAt: '2023-10-01',
    completedAt: '2023-10-14',
  },
  {
    id: 'task2',
    title: 'Implement Homepage Frontend',
    description: 'Develop HTML/CSS/JS for the approved homepage design',
    status: 'in-progress',
    priority: 'medium',
    projectId: 'proj1',
    assigneeId: 'emp1',
    dueDate: '2023-11-01',
    createdAt: '2023-10-16',
  },
  {
    id: 'task3',
    title: 'Setup React Project Structure',
    description: 'Initialize the React project and setup basic routing',
    status: 'done',
    priority: 'high',
    projectId: 'proj1',
    assigneeId: 'emp1',
    dueDate: '2023-10-10',
    createdAt: '2023-10-01',
    completedAt: '2023-10-08',
  },
  {
    id: 'task4',
    title: 'Design User Authentication Flows',
    description: 'Create wireframes for login, signup, and password recovery',
    status: 'review',
    priority: 'medium',
    projectId: 'proj2',
    assigneeId: 'emp2',
    dueDate: '2023-10-20',
    createdAt: '2023-09-20',
  },
  {
    id: 'task5',
    title: 'Implement User Authentication',
    description: 'Develop backend API endpoints for user authentication',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj2',
    assigneeId: 'emp3',
    dueDate: '2023-11-05',
    createdAt: '2023-10-01',
  },
  {
    id: 'task6',
    title: 'Setup CI/CD Pipeline',
    description: 'Configure Jenkins for continuous integration and deployment',
    status: 'done',
    priority: 'high',
    projectId: 'proj4',
    assigneeId: 'emp5',
    dueDate: '2023-09-15',
    createdAt: '2023-08-10',
    completedAt: '2023-09-12',
  },
  {
    id: 'task7',
    title: 'API Performance Testing',
    description: 'Conduct load testing and identify performance bottlenecks',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj3',
    assigneeId: 'emp3',
    dueDate: '2023-11-20',
    createdAt: '2023-11-01',
  },
  {
    id: 'task8',
    title: 'Database Optimization',
    description: 'Optimize database queries and indexes for better performance',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj3',
    assigneeId: 'emp3',
    dueDate: '2023-12-05',
    createdAt: '2023-11-01',
  },
  {
    id: 'task9',
    title: 'QA Testing for Mobile App',
    description: 'Conduct thorough testing of the mobile app features',
    status: 'todo',
    priority: 'high',
    projectId: 'proj2',
    assigneeId: 'emp6',
    dueDate: '2024-01-10',
    createdAt: '2023-10-15',
  },
  {
    id: 'task10',
    title: 'Create Analytics Dashboard Wireframes',
    description: 'Design wireframes for data visualization dashboard',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj5',
    assigneeId: 'emp2',
    dueDate: '2023-12-20',
    createdAt: '2023-12-01',
  },
  {
    id: 'task11',
    title: 'Implement Product Page',
    description: 'Create the product page with filtering and sorting features',
    status: 'review',
    priority: 'medium',
    projectId: 'proj1',
    assigneeId: 'emp1',
    dueDate: '2023-11-25',
    createdAt: '2023-10-25',
  },
  {
    id: 'task12',
    title: 'Setup AWS Infrastructure',
    description: 'Configure AWS services for the application deployment',
    status: 'done',
    priority: 'high',
    projectId: 'proj4',
    assigneeId: 'emp5',
    dueDate: '2023-10-20',
    createdAt: '2023-09-20',
    completedAt: '2023-10-18',
  },
];

export const getStatusLabel = (status: Status): string => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'review':
      return 'In Review';
    case 'done':
      return 'Completed';
    default:
      return status;
  }
};

export const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
    default:
      return priority;
  }
};
