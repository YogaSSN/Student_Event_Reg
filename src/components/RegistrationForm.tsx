import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Event, EventRegistration } from '../types';
import { toast } from 'sonner';

interface RegistrationFormProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ event, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    year: '',
    phoneNumber: '',
    whyInterested: '',
    priorExperience: '',
    teamMembers: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const additionalDetails = JSON.stringify({
        whyInterested: formData.whyInterested,
        priorExperience: formData.priorExperience,
        teamMembers: formData.teamMembers,
      });

      await registrationService.register({
        studentId: user?.rollNo || user?.facultyId,
        studentName: formData.studentName,
        email: formData.email,
        department: formData.department,
        year: formData.year,
        phoneNumber: formData.phoneNumber,
        eventId: event.id,
        additionalDetails,
      });

      toast.success('Registration submitted successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {event.title}</DialogTitle>
          <DialogDescription>
            Please provide your details to register for this event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Full Name</Label>
              <Input 
                id="studentName" 
                value={formData.studentName} 
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={formData.department} 
                onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, year: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} 
                placeholder="e.g. +1 234 567 890"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whyInterested">Why are you interested in this event?</Label>
            <Textarea 
              id="whyInterested" 
              value={formData.whyInterested} 
              onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorExperience">Prior Experience (if any)</Label>
            <Textarea 
              id="priorExperience" 
              value={formData.priorExperience} 
              onChange={(e) => setFormData({ ...formData, priorExperience: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamMembers">Team Members (optional)</Label>
            <Input 
              id="teamMembers" 
              value={formData.teamMembers} 
              onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })} 
              placeholder="Names of team members, separated by commas"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationForm;
