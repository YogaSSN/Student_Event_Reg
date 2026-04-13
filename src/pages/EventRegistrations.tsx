import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationService, eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EventRegistration, Event } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, ChevronLeft, User, Mail, Phone, BookOpen, GraduationCap, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const EventRegistrations: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOrganizer = event?.facultyId === user?.facultyId;

  useEffect(() => {
    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const fetchData = async () => {
    try {
      const [regsRes, eventsRes] = await Promise.all([
        registrationService.getEventRegistrations(eventId!),
        eventService.getAllEvents() // In a real app, we'd have getEventById
      ]);
      setRegistrations(regsRes.data);
      const currentEvent = eventsRes.data.find(e => e.id === eventId);
      if (currentEvent) setEvent(currentEvent);
    } catch (err) {
      toast.error('Failed to fetch registrations');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-96">Loading registrations...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registrations for {event?.title}</h1>
        <p className="text-gray-500 mt-1">Review and manage student applications for this event.</p>
      </div>

      <Card className="shadow-md border-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Registered Students</CardTitle>
              <CardDescription>Total: {registrations.length} registrations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No students have registered for this event yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Academic Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => {
                  const details = JSON.parse(reg.additionalDetails || '{}');
                  return (
                    <TableRow key={reg.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-50 rounded-full">
                            <User className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{reg.studentName}</div>
                            <div className="text-xs text-gray-500">{reg.studentId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {reg.department}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {reg.year}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <Mail className="h-3 w-3 mr-1" />
                            {reg.email}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Phone className="h-3 w-3 mr-1" />
                            {reg.phoneNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" title="View Details">
                              <Info className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Application Details: {reg.studentName}</DialogTitle>
                              <DialogDescription>
                                Registration for {event?.title}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700">Why Interested?</p>
                                <p className="text-sm bg-gray-50 p-3 rounded-md border">{details.whyInterested || 'N/A'}</p>
                              </div>
                              {details.priorExperience && (
                                <div className="space-y-2">
                                  <p className="text-sm font-semibold text-gray-700">Prior Experience</p>
                                  <p className="text-sm bg-gray-50 p-3 rounded-md border">{details.priorExperience}</p>
                                </div>
                              )}
                              {details.teamMembers && (
                                <div className="space-y-2">
                                  <p className="text-sm font-semibold text-gray-700">Team Members</p>
                                  <p className="text-sm bg-gray-50 p-3 rounded-md border">{details.teamMembers}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {reg.status === 'PENDING' && isOrganizer && (
                          <>
                            <Button 
                              size="icon" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(reg.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="destructive"
                              onClick={() => handleReject(reg.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {reg.status === 'PENDING' && !isOrganizer && (
                          <Badge variant="outline" className="text-gray-400 italic">View Only</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRegistrations;
