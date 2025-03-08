
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NewTeamMember = () => {
  const navigate = useNavigate();
  const { addEmployee } = useTaskContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !role) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Create the new employee
    const newEmployee = {
      name,
      email,
      role,
      avatar,
    };
    
    setTimeout(() => {
      try {
        addEmployee(newEmployee);
        toast.success('Team member added successfully!');
        navigate('/team');
      } catch (error) {
        toast.error('Failed to add team member');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }, 500); // Simulating API delay
  };

  // Generate new random avatar
  const generateNewAvatar = () => {
    setAvatar('https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70) + '&t=' + Date.now());
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/team')}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Team
        </Button>
        <h1 className="text-2xl font-bold">Add New Team Member</h1>
        <p className="text-muted-foreground">Add a new member to your team</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Team Member Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="space-y-2 text-center">
                <Avatar className="h-24 w-24 mx-auto border-2 border-border">
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="text-2xl">
                    {name ? getInitials(name) : 'N/A'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={generateNewAvatar}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role/Position *</Label>
              <Input
                id="role"
                placeholder="Enter role or position"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/team')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Team Member'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewTeamMember;
