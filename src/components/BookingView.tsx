
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Clock, BookOpen, Calendar as CalendarIcon, Trash2, Edit, User, Building, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { CalendarDayProps } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';

interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  bookedBy: string;
  description?: string;
  type?: 'booking' | 'task';
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
      bookedBy: 'John Smith',
      type: 'booking'
    },
    {
      id: '2',
      resourceId: '3',
      resourceName: 'Meeting Room 1',
      title: 'Client Call',
      date: new Date(),
      startTime: '14:00',
      endTime: '15:00',
      bookedBy: 'Sarah Johnson',
      type: 'booking'
    },
    {
      id: '3',
      title: 'Prepare Quarterly Report',
      date: new Date(),
      startTime: '11:00',
      endTime: '12:30',
      bookedBy: 'Michael Brown',
      resourceId: '',
      resourceName: '',
      type: 'task',
      description: 'Compile sales data and create presentation slides'
    },
  ]);

  const [newBooking, setNewBooking] = useState({
    resourceId: '',
    title: '',
    startTime: '',
    endTime: '',
    bookedBy: '',
    description: '',
    type: 'booking' as 'booking' | 'task'
  });

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'room' | 'equipment' | 'task' | 'booking'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const isSuperDark = resolvedTheme === 'superdark';

  const handleAddBooking = () => {
    if (newBooking.title && newBooking.startTime && newBooking.endTime && newBooking.bookedBy) {
      
      let booking: Booking = {
        id: Date.now().toString(),
        title: newBooking.title,
        date: selectedDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        bookedBy: newBooking.bookedBy,
        resourceId: '',
        resourceName: '',
        description: newBooking.description,
        type: newBooking.type
      };
      
      // If it's a resource booking, get the resource details
      if (newBooking.type === 'booking' && newBooking.resourceId) {
        const selectedResource = resources.find(resource => resource.id === newBooking.resourceId);
        if (selectedResource) {
          booking.resourceId = newBooking.resourceId;
          booking.resourceName = selectedResource.name;
        } else {
          toast.error("Selected resource not found");
          return;
        }
      }
      
      setBookings([...bookings, booking]);
      setNewBooking({
        resourceId: '',
        title: '',
        startTime: '',
        endTime: '',
        bookedBy: '',
        description: '',
        type: 'booking'
      });
      
      setIsBookingDialogOpen(false);
      toast.success(`${newBooking.type === 'booking' ? 'Booking' : 'Task'} created successfully!`);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    toast.success("Booking deleted successfully!");
  };

  const handleBookingDragStart = (booking: Booking, e: React.DragEvent) => {
    // Set data transfer object with booking details
    e.dataTransfer.setData("application/json", JSON.stringify({
      id: booking.id,
      text: `${booking.title} (${booking.type === 'booking' ? booking.resourceName : 'Task'})`,
      type: 'booking',
      originalData: booking
    }));
    
    // Set the drag effect
    e.dataTransfer.effectAllowed = "copy";
    
    // Optional: Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.innerHTML = `
      <div class="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded shadow-md">
        <Calendar class="h-4 w-4 mr-2" />
        <span>${booking.title}</span>
      </div>
    `;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up after drag operation starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    toast.info(`Drag ${booking.title} to calendar to reschedule`, { duration: 2000 });
  };

  // Filter bookings based on selected date and type
  const getFilteredBookings = useCallback(() => {
    let filtered = bookings.filter(
      booking => booking.date.toDateString() === selectedDate.toDateString()
    );
    
    if (filterType !== 'all') {
      if (filterType === 'room' || filterType === 'equipment') {
        filtered = filtered.filter(booking => {
          const resource = resources.find(r => r.id === booking.resourceId);
          return resource && resource.type === filterType;
        });
      } else {
        // Filter by booking type (task or booking)
        filtered = filtered.filter(booking => booking.type === filterType);
      }
    }
    
    return filtered;
  }, [bookings, selectedDate, filterType]);

  const selectedDateBookings = getFilteredBookings();
  
  // Count bookings/tasks for a specific date
  const getBookingCountForDate = (date: Date): number => {
    return bookings.filter(booking => booking.date.toDateString() === date.toDateString()).length;
  };

  const filteredResources = filterType === 'all' 
    ? resources 
    : resources.filter(resource => resource.type === filterType);
  
  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Resource Bookings & Tasks</h2>
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              New Booking/Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New {newBooking.type === 'booking' ? 'Booking' : 'Task'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {/* Booking Type Selection */}
              <div className="space-y-2">
                <Label>Select Type</Label>
                <Select 
                  value={newBooking.type} 
                  onValueChange={(value: 'booking' | 'task') => 
                    setNewBooking({ ...newBooking, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Resource Booking</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Resource Selection (only for bookings) */}
              {newBooking.type === 'booking' && (
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
                      {resources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.name}{resource.capacity ? ` (Capacity: ${resource.capacity})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBooking.title}
                  onChange={(e) => setNewBooking({ ...newBooking, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="border rounded-md p-2 bg-gray-50 dark:bg-gray-900">
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
                <Label htmlFor="bookedBy">Assigned To</Label>
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
              
              {/* Description field for tasks */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add details"
                  value={newBooking.description}
                  onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <Button onClick={handleAddBooking} className="w-full">
                Create {newBooking.type === 'booking' ? 'Booking' : 'Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className={cn("rounded-md border", "pointer-events-auto")}
              components={{
                Day: ({ date, children, ...props }: CalendarDayProps) => {
                  const bookingCount = getBookingCountForDate(date);
                  const hasBookings = bookingCount > 0;
                  
                  return (
                    <div
                      className={cn(
                        "w-full h-full relative cursor-pointer",
                        hasBookings && "font-medium"
                      )}
                      onClick={() => setSelectedDate(date)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add visual feedback when dragging over
                        e.currentTarget.classList.add("bg-primary/20", "outline-dashed", "outline-2", "outline-primary");
                      }}
                      onDragLeave={(e) => {
                        // Remove visual feedback
                        e.currentTarget.classList.remove("bg-primary/20", "outline-dashed", "outline-2", "outline-primary");
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove("bg-primary/20", "outline-dashed", "outline-2", "outline-primary");
                        
                        // Handle booking drops
                        try {
                          const data = e.dataTransfer.getData("application/json");
                          if (data) {
                            const item = JSON.parse(data);
                            if (item.type === 'booking' && item.originalData) {
                              // Update booking date and reset time
                              const updatedBookings = bookings.map(booking => 
                                booking.id === item.originalData.id 
                                  ? { ...booking, date } 
                                  : booking
                              );
                              setBookings(updatedBookings);
                              setSelectedDate(date);
                              toast.success(`Rescheduled "${item.originalData.title}" to ${format(date, 'MMM d, yyyy')}`);
                            }
                          }
                        } catch (error) {
                          console.error("Error handling drop:", error);
                        }
                      }}
                    >
                      {children}
                      
                      {/* Display indicators for bookings/tasks */}
                      {hasBookings && (
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                          <Badge className="h-1.5 w-1.5 p-0 rounded-full bg-primary" />
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Calendar Items for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'item' : 'items'}
              </Badge>
              <Select 
                value={filterType} 
                onValueChange={(value: any) => setFilterType(value)}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="booking">Bookings</SelectItem>
                  <SelectItem value="task">Tasks</SelectItem>
                  <SelectItem value="room">Rooms</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDateBookings.map((booking) => (
                      <TableRow 
                        key={booking.id}
                        className={cn(
                          "hover:bg-accent/10 cursor-grab",
                          booking.type === 'task' ? "bg-sky-50/50 dark:bg-sky-950/20" : ""
                        )}
                        draggable={true}
                        onDragStart={(e) => handleBookingDragStart(booking, e)}
                      >
                        <TableCell className="font-medium">
                          {booking.title}
                          {booking.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                              {booking.description}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={booking.type === 'booking' ? 'outline' : 'secondary'}>
                            {booking.type === 'booking' ? booking.resourceName || 'Booking' : 'Task'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            {booking.startTime} - {booking.endTime}
                          </span>
                        </TableCell>
                        <TableCell>{booking.bookedBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                            >
                              <CalendarIcon className="h-3.5 w-3.5" />
                              <span className="sr-only">Reschedule</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No items for this date</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsBookingDialogOpen(true)}
                >
                  Add Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            Available Resources
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="filterType" className="text-sm sr-only">Filter</Label>
            <Select value={filterType} onValueChange={value => {
              setFilterType(value as 'all' | 'room' | 'equipment');
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px] text-sm h-8">
                <Filter className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Filter resources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="room">Rooms Only</SelectItem>
                <SelectItem value="equipment">Equipment Only</SelectItem>
                <SelectItem value="booking">Bookings Only</SelectItem>
                <SelectItem value="task">Tasks Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedResources.map((resource) => (
              <div 
                key={resource.id} 
                className={cn(
                  "rounded-lg border p-4 transition-all hover:shadow-md",
                  isDark ? "bg-gray-900 border-gray-800" : "bg-white",
                  isSuperDark ? "bg-[#0D1117] border-[#1a1e26]" : ""
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.type === 'room' ? (
                        <span className="flex items-center gap-1 mt-1">
                          <User className="h-3.5 w-3.5" />
                          Capacity: {resource.capacity}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Equipment</span>
                      )}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setNewBooking({...newBooking, resourceId: resource.id, type: 'booking'});
                      setIsBookingDialogOpen(true);
                    }}
                  >
                    Book
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  {resource.type === 'room' ? (
                    <span>Room {resource.id}</span>
                  ) : (
                    <span>Asset #{resource.id}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingView;
