import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogIn, User as UserIcon, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [rollNo, setRollNo] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.studentLogin({ rollNo, password });
      login(res.data);
      toast.success('Login successful!');
      navigate('/events');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacultyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.facultyLogin({ facultyId, password });
      login(res.data);
      toast.success('Login successful!');
      navigate('/faculty-dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-600">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <LogIn className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student" className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span>Student</span>
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Faculty</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number</Label>
                  <Input 
                    id="rollNo" 
                    placeholder="e.g. 2021CS01" 
                    value={rollNo} 
                    onChange={(e) => setRollNo(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login as Student'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="faculty">
              <form onSubmit={handleFacultyLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facultyId">Faculty ID</Label>
                  <Input 
                    id="facultyId" 
                    placeholder="e.g. FAC123" 
                    value={facultyId} 
                    onChange={(e) => setFacultyId(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facultyPassword">Password</Label>
                  <Input 
                    id="facultyPassword" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login as Faculty'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-medium">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
