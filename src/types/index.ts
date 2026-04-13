export type Role = 'student' | 'faculty';

export interface User {
  rollNo?: string;
  facultyId?: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  facultyId: string;
  facultyName: string;
}

export interface EventRegistration {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  department: string;
  year: string;
  phoneNumber: string;
  eventId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  additionalDetails: string;
  event?: Event;
}

export interface Participation {
  id: string;
  studentRollNo: string;
  studentName: string;
  eventId: string;
  eventName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  event?: Event;
}
