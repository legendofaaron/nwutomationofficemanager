
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  assignedTo?: string;
  startTime?: string;
  endTime?: string;
}

const mockEmployees = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Sarah Johnson' },
  { id: '3', name: 'Michael Brown' },
];

const ScheduleView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      completed: false,
      assignedTo: 'John Smith',
      startTime: '09:00',
      endTime: '10:00'
    },
    {
      id: '2',
      title: 'Project Review',
      date: new Date(),
      completed: true,
      assignedTo: 'Sarah Johnson',
      startTime: '14:00',
      endTime: '15:00'
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: '',
    startTime: '',
    endTime: ''
  });

  // Add new states for upload and analyze functionality
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedScheduleData, setAnalyzedScheduleData] = useState<Partial<Task> | null>(null);

  const handleAddTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.startTime && newTask.endTime) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        date: selectedDate,
        completed: false,
        assignedTo: newTask.assignedTo,
        startTime: newTask.startTime,
        endTime: newTask.endTime
      };
      
      setTasks([...tasks, task]);
      setNewTask({ title: '', assignedTo: '', startTime: '', endTime: '' });
    }
  };

  // Add new handlers for file upload and analysis
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setAnalyzedScheduleData(null);
    }
  };

  const handleAnalyzeFile = () => {
    if (!selectedFile) {
      toast("Please select a file to analyze");
      return;
    }

    setIsAnalyzing(true);

    // Simulate file analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedScheduleData({
        title: "Quarterly Planning Session",
        assignedTo: "Michael Brown",
        startTime: "13:00",
        endTime: "15:30"
      });
      
      toast("Schedule data extracted successfully");
    }, 1500);
  };

  const handleApplyScheduleData = () => {
    if (!analyzedScheduleData) return;
    
    const newTaskFromFile: Task = {
      id: Date.now().toString(),
      title: analyzedScheduleData.title || 'Untitled Task',
      date: selectedDate,
      completed: false,
      assignedTo: analyzedScheduleData.assignedTo,
      startTime: analyzedScheduleData.startTime,
      endTime: analyzedScheduleData.endTime
    };
    
    setTasks([...tasks, newTaskFromFile]);
    setSelectedFile(null);
    setAnalyzedScheduleData(null);
    
    toast("New task added from analyzed file");
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Schedule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employee">Assign To</Label>
                        <Select
                          value={newTask.assignedTo}
                          onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={newTask.startTime}
                            onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={newTask.endTime}
                            onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddTask} className="w-full">
                        Add Schedule
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                <CardTitle>Tasks for {selectedDate.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks
                    .filter(task => 
                      task.date.toDateString() === selectedDate.toDateString()
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg",
                          task.completed ? "bg-muted/50" : "bg-card"
                        )}
                      >
                        <div className="space-y-1">
                          <span className={cn(task.completed && "line-through text-muted-foreground")}>
                            {task.title}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            <p>Assigned to: {task.assignedTo}</p>
                            <p>{task.startTime} - {task.endTime}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            setTasks(tasks.map(t =>
                              t.id === task.id ? { ...t, completed: !t.completed } : t
                            ));
                          }}
                          className="h-4 w-4"
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg",
                      task.completed ? "bg-muted/50" : "bg-card"
                    )}
                  >
                    <div className="space-y-1">
                      <span className={cn("block", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        <p>Date: {task.date.toLocaleDateString()}</p>
                        <p>Assigned to: {task.assignedTo}</p>
                        <p>{task.startTime} - {task.endTime}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        setTasks(tasks.map(t =>
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        ));
                      }}
                      className="h-4 w-4"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload and Analyze Section at the bottom */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload & Analyze Schedule</CardTitle>
          <CardDescription>Upload calendar documents or images to extract schedule information automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="schedule-file-upload">Select Schedule File</Label>
            <div className="flex gap-4">
              <Input 
                id="schedule-file-upload" 
                type="file" 
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.csv,.ics"
              />
              <Button 
                onClick={handleAnalyzeFile} 
                disabled={!selectedFile || isAnalyzing}
                variant="secondary"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedFile ? `Selected: ${selectedFile.name}` : "No file selected"}
            </div>
          </div>

          {analyzedScheduleData && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">Extracted Schedule Data:</h3>
              <div className="bg-muted rounded-md p-3">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(analyzedScheduleData, null, 2)}
                </pre>
              </div>
              <Button 
                onClick={handleApplyScheduleData}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleView;
