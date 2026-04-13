import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut, User as UserIcon, LayoutDashboard, List, CheckCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-bottom bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">EventHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'student' ? (
                  <>
                    <Link to="/events">
                      <Button variant="ghost" className="flex items-center space-x-1">
                        <List className="h-4 w-4" />
                        <span>All Events</span>
                      </Button>
                    </Link>
                    <Link to="/my-registrations">
                      <Button variant="ghost" className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>My Registrations</span>
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/faculty-dashboard">
                      <Button variant="ghost" className="flex items-center space-x-1">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Button>
                    </Link>
                    <Link to="/manage-events">
                      <Button variant="ghost" className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Manage Events</span>
                      </Button>
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-2 ml-4 border-l pl-4">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
