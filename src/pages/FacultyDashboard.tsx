import React, { useEffect, useState } from 'react';
import { registrationService, eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Event, EventRegistration } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Users, CheckCircle, XCircle, Plus, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FacultyDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.facultyId) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        eventService.getFacultyEvents(user!.facultyId!),
        registrationService.getEventRegistrations('all')
      ]);
      
      const facultyEvents = eventsRes.data;
      const facultyEventIds = new Set(facultyEvents.map(e => e.id));
      
      setEvents(facultyEvents);
      // Only show registrations for events that belong to THIS faculty member
      setRegistrations(registrationsRes.data.filter(r => facultyEventIds.has(r.eventId)));
    } catch (err) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await registrationService.approveRegistration(id);
      toast.success('Registration approved');
      fetchData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await registrationService.rejectRegistration(id);
      toast.success('Registration rejected');
      fetchData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const pendingCount = registrations.filter(p => p.status === 'PENDING').length;

  if (isLoading) return <div className="flex justify-center items-center h-96">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Manage your events and approvals here.</p>
        </div>
        <Link to="/manage-events">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-gray-400 mt-1">Events organized by you</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-xs text-gray-400 mt-1">Students registered across all events</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white border-l-4 border-l-yellow-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Approvals</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-gray-400 mt-1">Requires your immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Table */}
      <Card className="shadow-md border-none mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Review student participation requests</CardDescription>
          </div>
          {pendingCount > 0 && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
              {pendingCount} New Requests
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {registrations.filter(p => p.status === 'PENDING').length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No pending requests at the moment.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.filter(p => p.status === 'PENDING').map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.studentName}</TableCell>
                    <TableCell>{p.studentId}</TableCell>
                    <TableCell>{p.event?.title || 'Event'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApprove(p.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(p.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Events List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
        <Link to="/manage-events" className="text-indigo-600 hover:underline text-sm font-medium flex items-center">
          Manage all <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Link to={`/event-registrations/${event.id}`}>
                  <Button variant="outline" size="sm">View Registrations</Button>
                </Link>
              </div>
              <CardDescription className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(event.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && (
          <div className="col-span-2 text-center py-10 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">You haven't created any events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
