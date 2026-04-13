import axios from 'axios';
import { User, Event, Participation, EventRegistration } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const authService = {
  studentRegister: (data: any) => api.post('/student/register', data),
  studentLogin: (data: any) => api.post('/student/login', data),
  facultyRegister: (data: any) => api.post('/faculty/register', data),
  facultyLogin: (data: any) => api.post('/faculty/login', data),
};

export const eventService = {
  getAllEvents: () => api.get<Event[]>('/events'),
  getFacultyEvents: (facultyId: string) => api.get<Event[]>(`/events/faculty/${facultyId}`),
  createEvent: (data: any) => api.post('/events/create', data),
  updateEvent: (id: string, data: any) => api.put(`/events/update/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/events/delete/${id}`),
};

export const participationService = {
  registerForEvent: (data: any) => api.post('/participation/register', data),
  getStudentParticipations: (rollNo: string) => api.get<Participation[]>(`/participation/student/${rollNo}`),
  getFacultyParticipations: (facultyId: string) => api.get<Participation[]>(`/participation/faculty/${facultyId}`),
  approveParticipation: (participationId: string) => api.post('/participation/approve', { participationId }),
  rejectParticipation: (participationId: string) => api.post('/participation/reject', { participationId }),
};

export const registrationService = {
  register: (data: any) => api.post('/registrations/register', data),
  getStudentRegistrations: (studentId: string) => api.get<EventRegistration[]>(`/registrations/student/${studentId}`),
  getEventRegistrations: (eventId: string) => api.get<EventRegistration[]>(`/registrations/event/${eventId}`),
  approveRegistration: (id: string) => api.put(`/registrations/${id}/approve`),
  rejectRegistration: (id: string) => api.put(`/registrations/${id}/reject`),
};
