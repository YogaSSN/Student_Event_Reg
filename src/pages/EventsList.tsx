import React, { useEffect, useState } from 'react';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Event, EventRegistration } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, MapPin, User, Clock, Search, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';

import RegistrationForm from '../components/RegistrationForm';

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<EventRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegFormOpen, setIsRegFormOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [eventsRes, regsRes] = await Promise.all([
        eventService.getAllEvents(),
        user ? registrationService.getStudentRegistrations(user.rollNo || user.facultyId!) : Promise.resolve({ data: [] })
      ]);
      setEvents(eventsRes.data);
      setMyRegistrations(regsRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRegistrationStatus = (eventId: string) => {
    const reg = myRegistrations.find(r => r.eventId === eventId);
    return reg ? reg.status : null;
  };

  const getStatusButton = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Button className="w-full bg-green-600 hover:bg-green-600 cursor-default" disabled>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approved
          </Button>
        );
      case 'REJECTED':
        return (
          <Button className="w-full bg-red-600 hover:bg-red-600 cursor-default" disabled>
            <XCircle className="h-4 w-4 mr-2" />
            Rejected
          </Button>
        );
      default:
        return (
          <Button className="w-full bg-yellow-500 hover:bg-yellow-500 cursor-default" disabled>
            <Timer className="h-4 w-4 mr-2" />
            Pending Approval
          </Button>
        );
    }
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setIsRegFormOpen(true);
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center items-center h-96">Loading events...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Events</h1>
          <p className="text-gray-500 mt-1">Discover and register for upcoming campus activities</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-10" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="text-gray-500">Check back later for new events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden border-none shadow-md">
              <div className="h-3 bg-indigo-600" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2">Upcoming</Badge>
                  {getRegistrationStatus(event.id) && (
                    <Badge className={
                      getRegistrationStatus(event.id) === 'APPROVED' ? "bg-green-100 text-green-800 border-green-200" :
                      getRegistrationStatus(event.id) === 'REJECTED' ? "bg-red-100 text-red-800 border-red-200" :
                      "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }>
                      {getRegistrationStatus(event.id)}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-indigo-500" />
                  <span>Organized by: {event.facultyName}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t p-4">
                {getRegistrationStatus(event.id) ? (
                  getStatusButton(getRegistrationStatus(event.id)!)
                ) : (
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700" 
                    onClick={() => handleRegisterClick(event)}
                  >
                    Register Now
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedEvent && (
        <RegistrationForm 
          event={selectedEvent}
          isOpen={isRegFormOpen}
          onClose={() => setIsRegFormOpen(false)}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default EventsList;
