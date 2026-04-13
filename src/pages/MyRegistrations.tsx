import React, { useEffect, useState } from 'react';
import { registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { EventRegistration } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, MapPin, CheckCircle2, XCircle, Timer, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const MyRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.rollNo || user?.facultyId) {
      fetchMyRegistrations();
    }
  }, [user]);

  const fetchMyRegistrations = async () => {
    try {
      const id = user?.rollNo || user?.facultyId;
      const res = await registrationService.getStudentRegistrations(id!);
      setRegistrations(res.data);
    } catch (err) {
      toast.error('Failed to fetch your registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1"><Timer className="h-3 w-3" /> Pending</Badge>;
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-96">Loading your registrations...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Registrations</h1>
        <p className="text-gray-500 mt-1">Track the status of your event registration requests</p>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No registrations yet</h3>
          <p className="text-gray-500">Go to the Events List to find something interesting!</p>
        </div>
      ) : (
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle>Registration History</CardTitle>
            <CardDescription>Detailed view of your submitted applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => {
                  const details = JSON.parse(reg.additionalDetails || '{}');
                  return (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.event?.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {reg.event ? new Date(reg.event.date).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                              <Info className="h-4 w-4" />
                              View Info
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Registration Details</DialogTitle>
                              <DialogDescription>
                                Submitted for {reg.event?.title}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Department</p>
                                  <p className="font-medium">{reg.department}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Year</p>
                                  <p className="font-medium">{reg.year}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Phone</p>
                                  <p className="font-medium">{reg.phoneNumber}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Status</p>
                                  <div className="mt-1">{getStatusBadge(reg.status)}</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">Why Interested</p>
                                <p className="text-sm bg-gray-50 p-3 rounded-md">{details.whyInterested || 'N/A'}</p>
                              </div>
                              {details.priorExperience && (
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-500">Prior Experience</p>
                                  <p className="text-sm bg-gray-50 p-3 rounded-md">{details.priorExperience}</p>
                                </div>
                              )}
                              {details.teamMembers && (
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-500">Team Members</p>
                                  <p className="text-sm bg-gray-50 p-3 rounded-md">{details.teamMembers}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyRegistrations;
