
import React, { useState } from 'react';
import { useTaskContext, Employee } from '@/contexts/TaskContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui-custom/Pagination';
import {
  Loader2,
  Search,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { TeamMemberCard } from '@/components/ui-custom/TeamMemberCard';

const Team = () => {
  const { employees, tasks, projects, isLoading } = useTaskContext();
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 12;
  
  // Apply filters
  let filteredEmployees = [...employees];
  
  // Search filter
  if (searchQuery) {
    filteredEmployees = filteredEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Sort alphabetically by name
  filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));
  
  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team and assign them to projects and tasks
          </p>
        </div>
        <Button onClick={() => navigate('/team/new')}>
          <UserPlus className="h-4 w-4 mr-2" /> Add Team Member
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Team members grid */}
      <div>
        {filteredEmployees.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentEmployees.map((employee) => {
                const employeeTasks = tasks.filter(t => t.assigneeId === employee.id);
                const employeeProjects = projects.filter(p => p.teamIds.includes(employee.id));
                
                return (
                  <TeamMemberCard
                    key={employee.id}
                    employee={employee}
                    taskCount={employeeTasks.length}
                    projectCount={employeeProjects.length}
                    onClick={() => navigate(`/team/${employee.id}`)}
                  />
                );
              })}
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <Card className="py-16 flex flex-col items-center justify-center text-center">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 text-muted-foreground opacity-40" />
                <h3 className="mt-4 text-lg font-medium">No matching team members found</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Try adjusting your search to find what you're looking for
                </p>
                <Button onClick={() => setSearchQuery('')} className="mt-4">
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <div className={cn(
                  "h-20 w-20 rounded-full flex items-center justify-center",
                  "bg-primary/10 text-primary mb-2"
                )}>
                  <UserPlus className="h-10 w-10" />
                </div>
                <h3 className="mt-2 text-lg font-medium">No team members yet</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Get started by adding your first team member
                </p>
                <Button onClick={() => navigate('/team/new')} className="mt-4">
                  <UserPlus className="h-4 w-4 mr-2" /> Add Team Member
                </Button>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Team;
