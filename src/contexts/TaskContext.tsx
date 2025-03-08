import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { mockProjects, mockTasks, mockEmployees } from '@/lib/data';

// Define types
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';
export type Role = 'admin' | 'employee';

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: Status;
  teamIds: string[];
}

export interface CurrentUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
}

// Context state
interface TaskState {
  tasks: Task[];
  projects: Project[];
  employees: Employee[];
  currentUser: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
}

// Action types
type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'SET_CURRENT_USER'; payload: CurrentUser | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Context interface
interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByEmployee: (employeeId: string) => Task[];
  getProjectsByEmployee: (employeeId: string) => Project[];
  searchTasksAndProjects: (query: string) => { tasks: Task[], projects: Project[] };
  login: (email: string, role?: Role) => CurrentUser | null;
  logout: () => void;
  isAdmin: () => boolean;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  projects: [],
  employees: [],
  currentUser: null,
  isLoading: true,
  error: null,
};

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Reducer function
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload),
      };
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === action.payload.id ? action.payload : employee
        ),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter((employee) => employee.id !== action.payload),
      };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Context provider
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Check for logged in user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // In a real app, this would be an API call
        // Simulating API call with setTimeout
        setTimeout(() => {
          dispatch({ type: 'SET_TASKS', payload: mockTasks });
          dispatch({ type: 'SET_PROJECTS', payload: mockProjects });
          dispatch({ type: 'SET_EMPLOYEES', payload: mockEmployees });
          dispatch({ type: 'SET_LOADING', payload: false });
        }, 1000);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  // Helper functions
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Login functionality
  const login = (email: string, role: Role = 'employee'): CurrentUser | null => {
    // In a real app, this would validate against a real auth system
    const employee = state.employees.find(emp => emp.email === email);
    
    if (employee) {
      // For demo purposes, we'll allow login for any employee
      // and assign them a role based on the parameter or default to 'employee'
      const user: CurrentUser = {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        avatar: employee.avatar,
        role: role  // In a real app, this would come from the database
      };
      
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  };
  
  // Logout functionality
  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    localStorage.removeItem('currentUser');
  };
  
  // Check if current user is admin
  const isAdmin = (): boolean => {
    return state.currentUser?.role === 'admin';
  };

  // Context actions
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
  };

  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: generateId(),
    };
    dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
  };

  const updateEmployee = (employee: Employee) => {
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee });
  };

  const deleteEmployee = (id: string) => {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
  };

  // Filter functions based on user role
  const getTasksByProject = (projectId: string) => {
    // If user is admin, show all tasks for the project
    // If user is employee, only show tasks assigned to them in this project
    if (isAdmin()) {
      return state.tasks.filter((task) => task.projectId === projectId);
    } else if (state.currentUser) {
      return state.tasks.filter(
        (task) => 
          task.projectId === projectId && 
          task.assigneeId === state.currentUser?.id
      );
    }
    return [];
  };

  const getTasksByEmployee = (employeeId: string) => {
    // If user is admin, show tasks for any employee
    // If user is employee, only show their own tasks
    if (isAdmin() || state.currentUser?.id === employeeId) {
      return state.tasks.filter((task) => task.assigneeId === employeeId);
    }
    return [];
  };

  const getProjectsByEmployee = (employeeId: string) => {
    // If user is admin, show projects for any employee
    // If user is employee, only show their own projects
    if (isAdmin() || state.currentUser?.id === employeeId) {
      return state.projects.filter((project) => 
        project.teamIds.includes(employeeId)
      );
    }
    return [];
  };

  // Search functionality with role-based access
  const searchTasksAndProjects = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    let matchedTasks = state.tasks.filter(
      task => 
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    );
    
    let matchedProjects = state.projects.filter(
      project => 
        project.name.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery)
    );
    
    // Filter results based on user role
    if (!isAdmin() && state.currentUser) {
      matchedTasks = matchedTasks.filter(task => task.assigneeId === state.currentUser?.id);
      matchedProjects = matchedProjects.filter(project => project.teamIds.includes(state.currentUser?.id));
    }
    
    return { tasks: matchedTasks, projects: matchedProjects };
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        addTask,
        updateTask,
        deleteTask,
        addProject,
        updateProject,
        deleteProject,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getTasksByProject,
        getTasksByEmployee,
        getProjectsByEmployee,
        searchTasksAndProjects,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the context
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
