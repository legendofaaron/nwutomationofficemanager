
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  bookedBy: string;
}

interface Resource {
  id: string;
  name: string;
  type: 'room' | 'equipment';
  capacity?: number;
}

const resources: Resource[] = [
  { id: '1', name: 'Conference Room A', type: 'room', capacity: 10 },
  { id: '2', name: 'Conference Room B', type: 'room', capacity: 6 },
  { id: '3', name: 'Meeting Room 1', type: 'room', capacity: 4 },
  { id: '4', name: 'Projector', type: 'equipment' },
  { id: '5', name: 'Video Conference System', type: 'equipment' },
];

const mockEmployees = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Sarah Johnson' },
  { id: '3', name: 'Michael Brown' },
];

const BookingView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      resourceId: '1',
      resourceName: 'Conference Room A',
      title: 'Team Meeting',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      bookedBy: 'John Smith'
    },
    {
      id: '2',
      resourceId: '3',
      resourceName: 'Meeting Room 1',
      title: 'Client Call',
      date: new Date(),
      startTime: '14:00',
      endTime: '15:00',
      bookedBy: 'Sarah Johnson'
    },
  ]);

  const [newBooking, setNewBooking] = useState({
    resourceId: '',
    title: '',
    startTime: '',
    endTime: '',
    bookedBy: ''
  });

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const handleAddBooking = () => {
    if (newBooking.resourceId && newBooking.title && newBooking.startTime && newBooking.endTime && newBooking.bookedBy) {
      // Find the resource name based on the selected resourceId
      const selectedResource = resources.find(resource => resource.id === newBooking.resourceId);
      
      if (selectedResource) {
        const booking: Booking = {
          id: Date.now().toString(),
          resourceId: newBooking.resourceId,
          resourceName: selectedResource.name,
          title: newBooking.title,
          date: selectedDate,
          startTime: newBooking.startTime,
          endTime: newBooking.endTime,
          bookedBy: newBooking.bookedBy
        };
        
        setBookings([...bookings, booking]);
        setNewBooking({
          resourceId: '',
          title: '',
          startTime: '',
          endTime: '',
          bookedBy: ''
        });
        
        setIsBookingDialogOpen(false);
        toast.success("Booking created successfully!");
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    toast.success("Booking deleted successfully!");
  };

  // Filter bookings for the selected date
  const selectedDateBookings = bookings.filter(
    booking => booking.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Resource Bookings</h2>
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="resource">Select Resource</Label>
                <Select
                  value={newBooking.resourceId}
                  onValueChange={(value) => setNewBooking({ ...newBooking, resourceId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" disabled>Select a resource</SelectItem>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.name}{resource.capacity ? ` (Capacity: ${resource.capacity})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Booking Title</Label>
                <Input
                  id="title"
                  value={newBooking.title}
                  onChange={(e) => setNewBooking({ ...newBooking, title: e.target.value })}
                  placeholder="Enter booking purpose"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="border rounded-md p-2 bg-gray-50">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newBooking.endTime}
                    onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bookedBy">Booked By</Label>
                <Select
                  value={newBooking.bookedBy}
                  onValueChange={(value) => setNewBooking({ ...newBooking, bookedBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddBooking} className="w-full">
                Create Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className={cn("rounded-md border", "pointer-events-auto")}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bookings for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length > 0 ? (
              <div className="space-y-4">
                {selectedDateBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-white rounded-lg border p-4 flex justify-between items-start shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{booking.title}</h3>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Resource: {booking.resourceName}</p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {booking.startTime} - {booking.endTime}
                        </p>
                        <p>Booked by: {booking.bookedBy}</p>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No bookings for this date</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsBookingDialogOpen(true)}
                >
                  Add Booking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-lg border p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{resource.name}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setNewBooking({...newBooking, resourceId: resource.id});
                      setIsBookingDialogOpen(true);
                    }}
                  >
                    Book
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Type: {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  {resource.capacity && `, Capacity: ${resource.capacity}`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingView;
